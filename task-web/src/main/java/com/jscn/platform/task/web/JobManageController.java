/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.web;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jscn.commons.core.ext.ExtGridReturn;
import com.jscn.commons.core.ext.ExtPager;
import com.jscn.commons.core.lang.GenericResult;
import com.jscn.commons.core.mybatis.Criteria;
import com.jscn.commons.core.utils.ExceptionUtils;
import com.jscn.platform.task.dmo.QuazTriggers;
import com.jscn.platform.task.dmo.TaskConfig;
import com.jscn.platform.task.service.QuazTriggersService;

/**
 * Job管理
 * 
 * @author 袁兵 2012-3-13
 */
@Controller
@RequestMapping("/job/manager")
public class JobManageController {

    Logger              logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    QuazTriggersService quazTriggersService;

    @RequestMapping("/")
    public String list() {
        return "job/list";
    }

    @RequestMapping("/all")
    @ResponseBody
    public Object all(ExtPager pager, @RequestParam(required = false) String triggerName,
            @RequestParam(required = false) String triggerGroup) {
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
            criteria.setOrderByClause(" TRIGGER_GROUP desc ");
        }
        if (StringUtils.isNotBlank(triggerName)) {
            criteria.put("triggerName", triggerName);
        }
        if (StringUtils.isNotBlank(triggerGroup)) {
            criteria.put("triggerGroup", triggerGroup);
        }

        List<QuazTriggers> list = quazTriggersService.findQuazTriggersByCriteria(criteria);
        int count = quazTriggersService.getQuazTriggersCountByCriteria(criteria);
        ExtGridReturn<QuazTriggers> result = new ExtGridReturn<QuazTriggers>(count, list);

        return result;
    }

    @RequestMapping("/save")
    @ResponseBody
    public Object save(TaskConfig taskConfig, @RequestParam(required = true) String cronExpression)
            throws Exception {
        GenericResult<Integer> result = new GenericResult<Integer>();
        try {
            logger.debug("{} cronExpression=[{}]",taskConfig.toString(),cronExpression);
            Long editTaskId = 0l;
            if (taskConfig.getTaskId() != null){
            	editTaskId = taskConfig.getTaskId();
            }
            if(quazTriggersService.checkTaskConfigIsExist(editTaskId, taskConfig.getTriggerName(), taskConfig.getTriggerGroup())){
        		result.fail("error.save.trigger", "Trigger名称已经在"+taskConfig.getTriggerGroup()+"分组下存在！");
        		return result;
        	}
            if (taskConfig.getTaskId() == null) {//新增
            	
                int taskId = quazTriggersService.addTrigger(taskConfig, cronExpression);
                result.setObject(taskId);
            }else{//修改
                quazTriggersService.editTrigger(taskConfig, cronExpression);
            }
        } catch (Exception e) {
            logger.error("save task error:",e);
            result.fail("error.save.trigger",  ExceptionUtils.exceptionToString(e));
        }
        return result;
    }
    
    @RequestMapping("/delete")
    @ResponseBody
    public Object delete(@RequestParam(required = true) long taskId)
            throws Exception {
        GenericResult<Integer> result = new GenericResult<Integer>();
        try {
            quazTriggersService.removeTrigger(taskId);
        } catch (Exception e) {
            logger.error("delete task error:",e);
            result.fail("error.remove.trigger",  ExceptionUtils.exceptionToString(e));
        }
        return result;
    }
    
    @RequestMapping("/suspend")
    @ResponseBody
    public Object suspend(@RequestParam(required = true) long taskId)
            throws Exception {
        GenericResult<Integer> result = new GenericResult<Integer>();
        try {
            quazTriggersService.pauseTrigger(taskId);
        } catch (Exception e) {
            logger.error("suspend taskconfig error:",e);
            result.fail("error.suspend.trigger",  ExceptionUtils.exceptionToString(e));
        }
        return result;
    }
    
    @RequestMapping("/resume")
    @ResponseBody
    public Object resume(@RequestParam(required = true) long taskId)
            throws Exception {
        GenericResult<Integer> result = new GenericResult<Integer>();
        try {
            quazTriggersService.resumeTrigger(taskId);
        } catch (Exception e) {
            logger.error("resume task error:",e);
            result.fail("error.resume.trigger",  ExceptionUtils.exceptionToString(e));
        }
        return result;
    }
    
    @RequestMapping("/immediatelyCall")
    @ResponseBody
    public Object immediatelyCall(@RequestParam(required = true) long taskId)
            throws Exception {
        GenericResult<Integer> result = new GenericResult<Integer>();
        try {
            quazTriggersService.immediatelyCall(taskId);
        } catch (Exception e) {
            logger.error("immediatelyCall task error:",e);
            result.fail("error.immediatelyCall.trigger",  ExceptionUtils.exceptionToString(e));
        }
        return result;
    }
}
