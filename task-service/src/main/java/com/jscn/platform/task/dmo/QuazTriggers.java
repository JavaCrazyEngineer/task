/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.dmo;

import java.io.Serializable;
import java.util.Date;

import com.jscn.platform.task.util.Constant;

/**
 * quazTriggers dmo
 * 
 * @author 袁兵 2012-3-13
 */
public class QuazTriggers implements Serializable {
    
    private String schedName;

    private String triggerName;

    private String triggerGroup;

    private String jobName;

    private String jobGroup;

    private String desc;

    private Date   nextFireTime;

    private Date   prevFireTime;

    private int    priority;

    private String triggerState;

    private String triggerType;

    private Date   startTime;

    private Date   endTime;

    private String calendarName;

    private String misfireInstr;
    
    private long taskId;
    
    private String triggerUrl;
    
    private String cronExpression;

    public QuazTriggers() {

    }

    /**
     * @return the schedName
     */
    public String getSchedName() {
        return schedName;
    }

    /**
     * @param schedName the schedName to set
     */
    public void setSchedName(String schedName) {
        this.schedName = schedName;
    }

    /**
     * @return the triggerName
     */
    public String getTriggerName() {
        return triggerName;
    }

    /**
     * @param triggerName the triggerName to set
     */
    public void setTriggerName(String triggerName) {
        this.triggerName = triggerName;
    }

    /**
     * @return the triggerGroup
     */
    public String getTriggerGroup() {
        return triggerGroup;
    }

    /**
     * @param triggerGroup the triggerGroup to set
     */
    public void setTriggerGroup(String triggerGroup) {
        this.triggerGroup = triggerGroup;
    }

    /**
     * @return the jobName
     */
    public String getJobName() {
        return jobName;
    }

    /**
     * @param jobName the jobName to set
     */
    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    /**
     * @return the jobGroup
     */
    public String getJobGroup() {
        return jobGroup;
    }

    /**
     * @param jobGroup the jobGroup to set
     */
    public void setJobGroup(String jobGroup) {
        this.jobGroup = jobGroup;
    }

    /**
     * @return the desc
     */
    public String getDesc() {
        return desc;
    }

    /**
     * @param desc the desc to set
     */
    public void setDesc(String desc) {
        this.desc = desc;
    }

    /**
     * @return the nextFireTime
     */
    public Date getNextFireTime() {
        return nextFireTime;
    }

    /**
     * @param nextFireTime the nextFireTime to set
     */
    public void setNextFireTime(long nextFireTime) {
        this.nextFireTime = new Date(nextFireTime);
    }

    /**
     * @return the prevFireTime
     */
    public Date getPrevFireTime() {
        return prevFireTime;
    }

    /**
     * @param prevFireTime the prevFireTime to set
     */
    public void setPrevFireTime(long prevFireTime) {
        this.prevFireTime = new Date(prevFireTime);
    }

    /**
     * @return the priority
     */
    public int getPriority() {
        return priority;
    }

    /**
     * @param priority the priority to set
     */
    public void setPriority(int priority) {
        this.priority = priority;
    }

    /**
     * @return the triggerState
     */
    public String getTriggerState() {
        return triggerState;
    }

    /**
     * @param triggerState the triggerState to set
     */
    public void setTriggerState(String triggerState) {
        this.triggerState = triggerState;
    }

    /**
     * @return the triggerType
     */
    public String getTriggerType() {
        return triggerType;
    }

    /**
     * @param triggerType the triggerType to set
     */
    public void setTriggerType(String triggerType) {
        this.triggerType = triggerType;
    }

    /**
     * @return the startTime
     */
    public Date getStartTime() {
        return startTime;
    }

    /**
     * @param startTime the startTime to set
     */
    public void setStartTime(long startTime) {
        this.startTime = new Date(startTime);
    }

    /**
     * @return the endTime
     */
    public Date getEndTime() {
        return endTime;
    }

    /**
     * @param endTime the endTime to set
     */
    public void setEndTime(long endTime) {
        this.endTime = new Date(endTime);
    }

    /**
     * @return the calendarName
     */
    public String getCalendarName() {
        return calendarName;
    }

    /**
     * @param calendarName the calendarName to set
     */
    public void setCalendarName(String calendarName) {
        this.calendarName = calendarName;
    }

    /**
     * @return the misfireInstr
     */
    public String getMisfireInstr() {
        return misfireInstr;
    }

    /**
     * @param misfireInstr the misfireInstr to set
     */
    public void setMisfireInstr(String misfireInstr) {
        this.misfireInstr = misfireInstr;
    }

    /**
     * @return the taskId
     */
    public long getTaskId() {
        return taskId;
    }

    /**
     * @param taskId the taskId to set
     */
    public void setTaskId(long taskId) {
        this.taskId = taskId;
    }

    /**
     * @return the triggerUrl
     */
    public String getTriggerUrl() {
        return triggerUrl;
    }

    /**
     * @param triggerUrl the triggerUrl to set
     */
    public void setTriggerUrl(String triggerUrl) {
        this.triggerUrl = triggerUrl;
    }

    /**
     * @return the cronExpression
     */
    public String getCronExpression() {
        return cronExpression;
    }

    /**
     * @param cronExpression the cronExpression to set
     */
    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String toString() {
        return String
                .format("QuazTriggers [schedName=%s, triggerName=%s, triggerGroup=%s, jobName=%s, jobGroup=%s, desc=%s, nextFireTime=%s, prevFireTime=%s, priority=%s, triggerState=%s, triggerType=%s, startTime=%s, endTime=%s, calendarName=%s, misfireInstr=%s, taskId=%s, triggerUrl=%s, cronExpression=%s]",
                        schedName, triggerName, triggerGroup, jobName, jobGroup, desc,
                        nextFireTime, prevFireTime, priority, triggerState, triggerType, startTime,
                        endTime, calendarName, misfireInstr, taskId, triggerUrl, cronExpression);
    }
}
