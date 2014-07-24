/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.web;

import java.sql.Timestamp;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jscn.commons.core.ext.ExtGridReturn;
import com.jscn.commons.core.ext.ExtPager;
import com.jscn.commons.core.lang.GenericResult;
import com.jscn.commons.core.lang.Result;
import com.jscn.commons.core.mybatis.Criteria;
import com.jscn.commons.core.utils.ExceptionUtils;
import com.jscn.platform.task.dmo.TaskLog;
import com.jscn.platform.task.service.TaskLogService;
import com.jscn.platform.task.util.TaskStatusEnum;

/**
 * job history
 * 
 * @author 袁兵 2012-3-13
 */
@Controller
@RequestMapping("/job/log")
public class JobLogController {

    Logger         logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    TaskLogService taskLogService;

    @RequestMapping("/")
    public String history() {
        return "job/history";
    }

    @RequestMapping("/all")
    @ResponseBody
    public Object all(ExtPager pager,@RequestParam(required = false) Long logId, @RequestParam(required = false) Long taskId) {
        Criteria criteria = new Criteria();
        // 设置分页信息
        if (pager.getLimit() != null && pager.getStart() != null) {
            criteria.setOracleEnd(pager.getLimit() + pager.getStart());
            criteria.setOracleStart(pager.getStart());
        }
        // 排序信息
        if (StringUtils.isNotBlank(pager.getDir()) && StringUtils.isNotBlank(pager.getSort())) {
            criteria.setOrderByClause(pager.getCommonDBSort() + " " + pager.getDir());
        } else {
            criteria.setOrderByClause(" TASK_ID desc ");
        }
        if (taskId != null) {
            criteria.put("taskId", taskId);
        }

        List<TaskLog> list = taskLogService.findGroupTaskLogsByCriteria(criteria);
        int count = taskLogService.getGroupTaskLogsCountByCriteria(criteria);
        ExtGridReturn<TaskLog> result = new ExtGridReturn<TaskLog>(count, list);

        return result;
    }
    
    @RequestMapping("/grouplist")
    @ResponseBody
    public Object groupList(ExtPager pager,@RequestParam(required = false) Long logId, @RequestParam(required = false) Long taskId){
        Criteria criteria = new Criteria();
        // 设置分页信息
        if (pager.getLimit() != null && pager.getStart() != null) {
            criteria.setOracleEnd(pager.getLimit() + pager.getStart());
            criteria.setOracleStart(pager.getStart());
        }
        // 排序信息
        if (StringUtils.isNotBlank(pager.getDir()) && StringUtils.isNotBlank(pager.getSort())) {
            criteria.setOrderByClause(pager.getCommonDBSort() + " " + pager.getDir());
        } else {
            criteria.setOrderByClause(" LOG_ID desc ");
        }
        if (taskId != null) {
            criteria.put("taskId", taskId);
        }

        List<TaskLog> list = taskLogService.findTaskLogsByCriteria(criteria);
        int count = taskLogService.getTaskLogsCountByCriteria(criteria);
        ExtGridReturn<TaskLog> result = new ExtGridReturn<TaskLog>(count, list);

        return result;
    }
    
    @RequestMapping("/delete")
    @ResponseBody
    public Object delete(@RequestParam(required = true) long logId)
            throws Exception {
        GenericResult<Integer> result = new GenericResult<Integer>();
        try {
            taskLogService.removeTaskLog(logId);
        } catch (Exception e) {
            logger.error("delete log error:",e);
            result.fail("error.delete.tasklog", ExceptionUtils.exceptionToString(e));
        }
        return result;
    }
    
    @RequestMapping("/restart")
    @ResponseBody
    public Object restart(@RequestParam(required = true) long logId)
            throws Exception {
        GenericResult<Integer> result = new GenericResult<Integer>();
        try {
            taskLogService.restartTask(logId);
        } catch (Exception e) {
            logger.error("restart log error:",e);
            result.fail("error.delete.tasklog",  ExceptionUtils.exceptionToString(e));
        }
        return result;
    }

    @RequestMapping(value = "/receipt", produces="text/plain")
    @ResponseBody
    public Object receipt(@RequestParam(required = true) Long id,
            @RequestParam(required = true) int result, @RequestParam(required = false) String desc) {
        try {
            taskLogService.receipt(id, result, desc);
            return "0";
        } catch (Exception e) {
            logger.error("receipt error:",e);
            return "1";
        }
    }
}
