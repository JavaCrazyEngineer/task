/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.interceptor;

import java.util.Collections;
import java.util.Enumeration;
import java.util.Set;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.jscn.commons.core.lang.AppContext;
import com.jscn.commons.core.utils.TextParseUtil;

/**
 * controller访问轨迹
 * 
 * @author 袁兵 2012-3-9
 */
public class AccessTraceInterceptor extends HandlerInterceptorAdapter {

    protected static final Logger LOG              = LoggerFactory.getLogger("AccessLogger");

    protected static String       KEY_OF_STIME     = "START_TIME_KEY";

    // 不允许记录的action参数列表
    protected String              excludeParams;

    protected Set<String>         excludeParamsSet = Collections.emptySet();

    // 截取参数的最大长度
    protected int                 maxLength        = 100;

    /**
     * @return the excludeParams
     */
    public String getExcludeParams() {
        return excludeParams;
    }

    /**
     * @param excludeParams the excludeParams to set
     */
    public void setExcludeParams(String excludeParams) {
        this.excludeParams = excludeParams;
        this.excludeParamsSet = TextParseUtil.commaDelimitedStringToSet(excludeParams);
    }

    /**
     * This implementation always returns <code>true</code>.
     */
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
            Object handler) throws Exception {

        //把初始时间放在线程上下文中
        AppContext.get().put(KEY_OF_STIME, new Long(System.currentTimeMillis()));

        // 获取当前登录用户
        String userName = (String) request.getSession().getAttribute("USERNAME");

        // 获取用户登录IP
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // 向MDC里面set ip、user
        MDC.put("ip", ip);
        MDC.put("user", userName);

        // 调用流水号
        MDC.put("invokeNo", UUID.randomUUID().toString().replace("-", ""));

        return true;
    }

    /**
     * This implementation is empty.
     */
    @SuppressWarnings("rawtypes")
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
            Object handler, Exception ex) throws Exception {

        // 取parameters
        Enumeration parameters = request.getParameterNames();

        // 计算action method执行方法
        long executionTime = 0L;

        // 拼接LOG信息
        StringBuilder message = new StringBuilder(500);

        String referer = request.getHeader("Referer");
        message.append("Referer:");
        message.append(referer);
        
        //从线程上下文中获取starttime 计算总耗时
        executionTime = System.currentTimeMillis() - (Long) (AppContext.get().get(KEY_OF_STIME));
        
        //清楚线程上下文
        AppContext.get().clear();

        message.append("|Url:");
        message.append("http://").append(request.getServerName()).append(":")
                .append(request.getServerPort()).append(request.getContextPath())
                .append(request.getServletPath());

        message.append("|Params:");
        StringBuilder params = new StringBuilder();
        while (parameters.hasMoreElements()) {
            String param = (String) parameters.nextElement();
            // 判断参数是否允许记入log
            if (TextParseUtil.applyParam(excludeParamsSet, param)) {
                String value = request.getParameter(param);
                params.append(param);
                params.append("=");
                params.append(TextParseUtil.cutString(value, this.maxLength));
                params.append("&");
            }
        }
        if (params.toString().length() > 0) {
            message.append(params.toString().substring(0, params.toString().length() - 1));
        }
        message.append("|Spend:").append(executionTime).append("ms");
        // 记录日志
        LOG.info(message.toString());

        // 清除MDC里面的历史信息
        MDC.remove("ip");
        MDC.remove("user");
        MDC.remove("invokeNo");
    }

}
