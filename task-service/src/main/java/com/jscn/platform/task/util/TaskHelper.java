/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.util;

import java.util.HashMap;
import java.util.Map;

import com.jscn.commons.core.http.HttpClientUtil;

/**
 * 请输入功能描述
 *
 * @author 袁兵  2012-3-27
 */
public class TaskHelper {
    /**
     * 调用任务URL
     * @param triggerName
     * @param taskLog
     */
    public static void invokeTaskUrl( Long logId,String triggerName,String triggerUrl) {
        Map<String, String> params = new HashMap<String, String>();
        params.put(Constant.PARAM_TASK_LOG_ID, logId.toString());
        params.put(Constant.PARAM_TRIGGER_NAME, triggerName);
        HttpClientUtil.post(triggerUrl,params);
    }
}
