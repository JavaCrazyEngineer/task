/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.service;

import java.util.List;

import com.jscn.commons.core.mybatis.Criteria;
import com.jscn.platform.task.dmo.QuazTriggers;
import com.jscn.platform.task.dmo.TaskConfig;

/**
 * quaz trigger service interface
 * 
 * @author 袁兵 2012-3-13
 */
public interface QuazTriggersService {

    /**
     * 根据条件查询记录集
     * @param criteria
     * @return
     */
    public List<QuazTriggers> findQuazTriggersByCriteria(Criteria criteria);

    /**
     * 根据条件查询记录总数
     * @param criteria
     * @return
     */
    public int getQuazTriggersCountByCriteria(Criteria criteria);

    /**
     * 根据trigger名称 分组查询对应的trigger
     * @param triggerName
     * @param triggerGroup
     * @return
     */
    public QuazTriggers getQuazTriggerByTriggerNameAndGroup(String triggerName, String triggerGroup);

    /**
     * 根据taskId查询QuazTriggers
     * @param taskId
     * @return
     */
    public QuazTriggers getQuazTriggerByTaskId(long taskId);

    /**
     * 新增任务
     * @param triggerName
     * @param triggerGroup
     * @param cronExpression
     */
    public int addTrigger(TaskConfig taskConfig, String cronExpression);

    /**
     * 修改任务
     * @param taskId
     * @param cronExpression
     * @param triggerUrl
     */
    public void editTrigger(TaskConfig taskConfig, String cronExpression);

    /**
     * 修改任务调用url
     * @param taskId
     * @param triggerUrl
     */
    public void editTriggerUrl(long taskId, String triggerUrl);

    /**
     * 修改任务执行时间
     * @param taskId
     * @param cronExpression
     */
    public void editTriggerCron(long taskId, String cronExpression);

    /**
     * 删除任务
     * @param taskId
     */
    public void removeTrigger(long taskId);

    /**
     * 暂停触发器
     * @param taskId
     */
    public void pauseTrigger(long taskId);

    /**
     * 重启触发器
     * @param taskId
     */
    public void resumeTrigger(long taskId);

    /**
     * 立即调用触发器
     * @param taskId
     */
    public void immediatelyCall(long taskId);
    /**
     * 判断TaskConfig是否已经存在
     * @return
     */
    public boolean checkTaskConfigIsExist(Long taskId,String triggerName,String triggerGroup);
    
}
