/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.util;

import java.util.HashMap;
import java.util.Map;

/**
 * 系统常用常量定义
 * 
 * @author 袁兵 2012-3-22
 */
public class Constant {
    public static final Map<String, String> quazStatus = new HashMap<String, String>();
    static {
        quazStatus.put("ACQUIRED", "运行中");
        quazStatus.put("PAUSED", "暂停中");
        quazStatus.put("WAITING", "等待中");
    }
    
    /**
     * 任务调用taskId参数名
     */
    public static final String PARAM_TASK_LOG_ID = "id";
    
    /**
     * 任务调用trigger参数名
     */
    public static final String PARAM_TRIGGER_NAME = "triggerName";
    /**
     * 用户已经登录Session  Key
     */
    public static final String USER_IS_LOGIN = "user_is_login";
    /**
     * 用户登录超时信息
     */
    public static final String TIME_OUT = "{'success':false,'errorCode':'exception','message':'timeout'}";
}
