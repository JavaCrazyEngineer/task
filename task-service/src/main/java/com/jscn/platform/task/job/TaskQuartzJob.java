/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.job;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Trigger;
import org.springframework.scheduling.quartz.QuartzJobBean;

import com.jscn.platform.task.service.SimpleJobService;

/**
 * quartz job 入口
 * 
 * @author 袁兵 2012-3-8
 */
public class TaskQuartzJob extends QuartzJobBean {

    private SimpleJobService simpleJobService;

    public void setSimpleJobService(SimpleJobService simpleJobService) {
        this.simpleJobService = simpleJobService;
    }

    @Override
    protected void executeInternal(JobExecutionContext jobexecutioncontext)
            throws JobExecutionException {
        Trigger trigger = jobexecutioncontext.getTrigger();
        String triggerName = trigger.getKey().getName();
        String triggerGroup = trigger.getKey().getGroup();
        
        //处理具体job
        simpleJobService.doJob(triggerName, triggerGroup);
    }
}
