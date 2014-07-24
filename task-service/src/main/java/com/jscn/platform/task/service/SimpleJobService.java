/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.service;

import java.io.Serializable;
import java.sql.Timestamp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.jscn.commons.core.mybatis.Criteria;
import com.jscn.commons.core.spring.SpringContextHolder;
import com.jscn.platform.task.dao.TaskConfigDAO;
import com.jscn.platform.task.dao.TaskLogDAO;
import com.jscn.platform.task.dmo.TaskConfig;
import com.jscn.platform.task.dmo.TaskLog;
import com.jscn.platform.task.util.TaskHelper;
import com.jscn.platform.task.util.TaskStatusEnum;

/**
 * 负责job分发
 * 
 * @author 袁兵 2012-3-8
 */
@Service("simpleJobService")
public class SimpleJobService implements Serializable {

    /**
     * 
     */
    private static final long   serialVersionUID = -2353890892189626209L;

    private static final Logger logger           = LoggerFactory.getLogger(SimpleJobService.class);

    // @Transactional(readOnly = false, propagation = Propagation.REQUIRED,
    // rollbackFor = { Exception.class })
    public void doJob(String triggerName, String triggerGroup) {
        // TODO:事务如何保证
        logger.info("begin do job... triggerName:[{}] triggerGroup:[{}] ", triggerName,
                triggerGroup);
        Criteria example = new Criteria();
        example.put("triggerName", triggerName);
        example.put("triggerGroup", triggerGroup);
        // 查询任务调用URL
        TaskConfigDAO taskConfigDAO = SpringContextHolder.getBean("taskConfigDAO");
        TaskConfig taskConfig = taskConfigDAO.selectByExample(example);
        
        //调用任务URL
        doJob(taskConfig);
    }
    
    /**
     * 调用job URL
     * @param taskConfig
     */
    public void doJob(TaskConfig taskConfig){
        TaskLog taskLog = addTaskLog(taskConfig);

        logger.debug("task trigger url:[{}]", taskConfig.getTriggerUrl());
        try {
            TaskHelper.invokeTaskUrl(taskLog.getLogId(), taskConfig.getTriggerName(), taskConfig.getTriggerUrl());
        } catch (Exception e) {
            logger.error("invoke task url error:",e);
            //修改调用记录状态
            invokeFail(taskLog,e.getMessage());           
        }
    }

    /**
     * 记录调用失败log
     * @param taskLog
     */
    private void invokeFail(TaskLog taskLog,String errorMsg) {
        taskLog.setStatus(TaskStatusEnum.FAILURE.getStatusEN());
        taskLog.setEndTime(new Timestamp(System.currentTimeMillis()));
        taskLog.setResultDesc(errorMsg);
        TaskLogDAO taskLogDAO = SpringContextHolder.getBean("taskLogDAO");
        taskLogDAO.updateByPrimaryKeySelective(taskLog);
    }

    /**
     * 新增TaskLog
     * @param taskConfig
     * @return
     */
    private TaskLog addTaskLog(TaskConfig taskConfig) {
        TaskLog taskLog = new TaskLog();
        taskLog.setTaskId(taskConfig.getTaskId());
        taskLog.setStatus(TaskStatusEnum.START.getStatusEN());
        taskLog.setStartTime(new Timestamp(System.currentTimeMillis()));
        TaskLogDAO taskLogDAO = SpringContextHolder.getBean("taskLogDAO");
        taskLogDAO.insertSelective(taskLog);
        logger.debug(taskLog.toString());
        return taskLog;
    }
}
