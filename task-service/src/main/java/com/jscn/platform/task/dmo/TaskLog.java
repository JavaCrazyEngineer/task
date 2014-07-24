/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.dmo;

import java.io.Serializable;
import java.util.Date;

/**
 * 请输入功能描述
 *
 * @author 袁兵  2012-3-16
 */
public class TaskLog implements Serializable {

    private Long logId;
    
    private Long taskId;
    
    private String status;
    
    private String resultDesc;
    
    private Date startTime;
    
    private Date endTime;
    
    public TaskLog(){
        
    }

    /**
     * @return the logId
     */
    public Long getLogId() {
        return logId;
    }

    /**
     * @param logId the logId to set
     */
    public void setLogId(Long logId) {
        this.logId = logId;
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
     * @return the status
     */
    public String getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * @return the resultDesc
     */
    public String getResultDesc() {
        return resultDesc;
    }

    /**
     * @param resultDesc the resultDesc to set
     */
    public void setResultDesc(String resultDesc) {
        this.resultDesc = resultDesc;
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
    public void setStartTime(Date startTime) {
        this.startTime = startTime;
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
    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String toString() {
        return String
                .format("TaskLog [logId=%s, taskId=%s, status=%s, resultDesc=%s, startTime=%s, endTime=%s]",
                        logId, taskId, status, resultDesc, startTime, endTime);
    }  
}
