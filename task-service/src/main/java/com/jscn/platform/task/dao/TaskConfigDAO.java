/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.dao;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.jscn.commons.core.mybatis.Criteria;
import com.jscn.platform.task.dmo.TaskConfig;

/**
 * task config dao
 * 
 * @author 袁兵 2012-3-21
 */
@Repository
public interface TaskConfigDAO {
    /**
     * 保存记录,不管记录里面的属性是否为空
     */
    int insert(TaskConfig record);

    /**
     * 根据条件删除记录
     */
    int deleteByExample(Criteria example);

    /**
     * 根据主键删除记录
     */
    int deleteByPrimaryKey(long taskId);

    /**
     * 根据条件查询记录集
     */
    TaskConfig selectByExample(Criteria example);

    /**
     * 根据主键查询记录
     */
    TaskConfig selectByPrimaryKey(long taskId);

    /**
     * 根据条件更新属性不为空的记录
     */
    int updateByExampleSelective(@Param("record") TaskConfig record,
            @Param("condition") Map<String, Object> condition);

    /**
     * 根据主键更新属性不为空的记录
     */
    int updateByPrimaryKeySelective(TaskConfig record);
    /**
     * 判断一个分组下的triggerName是否重复
     * @param taskId  编辑时排除的taskId
     * @param triggerName
     * @param triggerGroup
     * @return
     */
    int checkExistsTask(@Param("taskId") Long taskId,@Param("triggerName") String triggerName,@Param("triggerGroup") String triggerGroup);
}
