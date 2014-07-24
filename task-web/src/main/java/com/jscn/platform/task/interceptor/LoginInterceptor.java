package com.jscn.platform.task.interceptor;


import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.jscn.platform.task.util.Constant;

public class LoginInterceptor extends HandlerInterceptorAdapter {
	private static final Logger logger = LoggerFactory.getLogger(LoginInterceptor.class);
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		Boolean isLogin = (Boolean)request.getSession().getAttribute(Constant.USER_IS_LOGIN);
		if(isLogin == null || !isLogin){
			logger.info("用户还未登录，跳转到登录页面");
			String requestedWith = request.getHeader("x-requested-with");
			// ajax请求
			if (requestedWith != null && "XMLHttpRequest".equals(requestedWith)) {
				response.setHeader("session-status", "timeout");
				response.getWriter().print(Constant.TIME_OUT);
			} else {
				// 普通页面请求
				String rootPath = request.getContextPath() + "/";
				PrintWriter out = null;
				out = response.getWriter();
				out.println("<script type='text/javascript'>");  
			    out.println("window.open('"+rootPath+"','_top')");  
			    out.println("</script>");  
			    out.close();
			}
		    return false;
		}
	    return true;
	}
}
