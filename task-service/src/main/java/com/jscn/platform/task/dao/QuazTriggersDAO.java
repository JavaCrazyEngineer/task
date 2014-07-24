/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.jscn.commons.core.mybatis.Criteria;
import com.jscn.platform.task.dmo.QuazTriggers;

/**
 * quaz trigger dao
 *
 * @author 袁兵  2012-3-13
 */
@Repository
public interface QuazTriggersDAO {
    
    /**
     * 根据条件查询记录集
     * @param criteria
     * @return
     */
    List<QuazTriggers> findByCriteria(Criteria criteria);
    
    /**
     * 根据条件查询记录总数
     * @param criteria
     * @return
     */
    int countByCriteria(Criteria criteria);
    
    /**
     * 根据trigger名称 分组查询对应的trigger
     * @param triggerName
     * @param triggerGroup
     * @return
     */
    QuazTriggers getQuazTriggerByTriggerNameAndGroup(@Param("triggerName") String triggerName,
            @Param("triggerGroup") String triggerGroup);
    
    /**
     * 根据taskId查询对于的trigger
     * @param taskId
     * @return
     */
    QuazTriggers getQuazTriggerByTaskId(@Param("taskId") long taskId);
}
