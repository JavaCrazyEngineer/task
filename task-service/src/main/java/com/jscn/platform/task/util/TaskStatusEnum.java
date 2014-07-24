/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.util;

/**
 * 请输入功能描述
 *
 * @author 袁兵  2012-3-27
 */
public enum TaskStatusEnum {
    
    START("START"),END("END"),FAILURE("FAILURE");
    
    
    private TaskStatusEnum(String statusEN){
        this.setStatusEN(statusEN);
    }
    
    
    /**
     * @return the statusEN
     */
    public String getStatusEN() {
        return statusEN;
    }


    /**
     * @param statusEN the statusEN to set
     */
    public void setStatusEN(String statusEN) {
        this.statusEN = statusEN;
    }


    private String statusEN;
}
