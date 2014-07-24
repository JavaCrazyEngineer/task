/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.dmo;

import java.io.Serializable;

/**
 * 请输入功能描述
 *
 * @author 袁兵  2012-3-16
 */
@SuppressWarnings("serial")
public class TaskConfig implements Serializable {
    
    private Long taskId;
    
    private String triggerName;
    
    private String triggerGroup;
    
    private String triggerUrl;

    public TaskConfig(){
        
    }

    /**
     * @param triggerName
     * @param triggerGroup
     * @param triggerUrl
     */
    public TaskConfig(String triggerName, String triggerGroup, String triggerUrl) {
        super();
        this.triggerName = triggerName;
        this.triggerGroup = triggerGroup;
        this.triggerUrl = triggerUrl;
    }

    /**
     * @return the taskId
     */
    public Long getTaskId() {
        return taskId;
    }

    /**
     * @param taskId the taskId to set
     */
    public void setTaskId(Long taskId) {
        this.taskId = taskId;
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
     * {@inheritDoc}
     */
    @Override
    public String toString() {
        return String.format(
                "TaskConfig [taskId=%s, triggerName=%s, triggerGroup=%s, triggerUrl=%s]", taskId,
                triggerName, triggerGroup, triggerUrl);
    }
    
    
}
