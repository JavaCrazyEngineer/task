/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.service.impl;

import java.sql.Timestamp;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jscn.commons.core.mybatis.Criteria;
import com.jscn.commons.core.spring.SpringContextHolder;
import com.jscn.platform.task.dao.TaskConfigDAO;
import com.jscn.platform.task.dao.TaskLogDAO;
import com.jscn.platform.task.dmo.TaskConfig;
import com.jscn.platform.task.dmo.TaskLog;
import com.jscn.platform.task.service.TaskLogService;
import com.jscn.platform.task.util.TaskHelper;
import com.jscn.platform.task.util.TaskStatusEnum;

/**
 * 请输入功能描述
 * 
 * @author 袁兵 2012-3-27
 */
@Service
public class TaskLogServiceImpl implements TaskLogService {

    Logger        logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    TaskLogDAO    taskLogDAO;

    @Autowired
    TaskConfigDAO taskConfigDAO;

    /**
     * {@inheritDoc}
     */
    @Override
    public List<TaskLog> findTaskLogsByCriteria(Criteria criteria) {
        return taskLogDAO.selectByExample(criteria);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<TaskLog> findGroupTaskLogsByCriteria(Criteria criteria) {
        return taskLogDAO.selectGroupTaskLog(criteria);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public int getTaskLogsCountByCriteria(Criteria criteria) {
        return taskLogDAO.countByExample(criteria);
    }

    /**
     * {@inheritDoc}
     */
    public int getGroupTaskLogsCountByCriteria(Criteria criteria) {
        return taskLogDAO.countGroupTaskLogByExample(criteria);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public TaskLog getTaskLogById(Long logId) {
        return taskLogDAO.selectByPrimaryKey(logId);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void editTaskLog(TaskLog taskLog) {
        taskLogDAO.updateByPrimaryKeySelective(taskLog);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = { Exception.class })
    public void receipt(Long logId, int result, String desc) {
        TaskLog taskLog = taskLogDAO.selectByPrimaryKey(logId);
        if (result == 0) {// 任务执行成功
            taskLog.setStatus(TaskStatusEnum.END.getStatusEN());
        } else {// 任务执行失败
            taskLog.setStatus(TaskStatusEnum.FAILURE.getStatusEN());
        }
        taskLog.setResultDesc(desc);
        taskLog.setEndTime(new Timestamp(System.currentTimeMillis()));
        taskLogDAO.updateByPrimaryKeySelective(taskLog);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void removeTaskLog(Long logId) {
        taskLogDAO.deleteByPrimaryKey(logId);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = { Exception.class })
    public void restartTask(Long logId) {
        TaskLog taskLog = taskLogDAO.selectByPrimaryKey(logId);
        TaskConfig taskConfig = taskConfigDAO.selectByPrimaryKey(taskLog.getTaskId());

        try {
            // 修改log状态
            taskLog.setStartTime(new Timestamp(System.currentTimeMillis()));
            taskLog.setStatus(TaskStatusEnum.START.getStatusEN());
            taskLog.setEndTime(new Timestamp(0));
            taskLogDAO.updateByPrimaryKeySelective(taskLog);
            // 再次调用任务URL
            TaskHelper.invokeTaskUrl(taskLog.getLogId(), taskConfig.getTriggerName(),
                    taskConfig.getTriggerUrl());
        } catch (Exception e) {
            logger.error("restart invoke task url error:", e);
            // 修改调用记录状态
            invokeFail(taskLog, e.getMessage());
        }
    }

    /**
     * 记录调用失败log
     * @param taskLog
     */
    private void invokeFail(TaskLog taskLog, String errorMsg) {
        taskLog.setStatus(TaskStatusEnum.FAILURE.getStatusEN());
        taskLog.setEndTime(new Timestamp(System.currentTimeMillis()));
        taskLog.setResultDesc(errorMsg);
        taskLogDAO.updateByPrimaryKeySelective(taskLog);
    }

}
