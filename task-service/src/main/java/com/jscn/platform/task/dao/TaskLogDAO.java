/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.dao;

import java.io.Serializable;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.jscn.commons.core.mybatis.Criteria;
import com.jscn.platform.task.dmo.TaskLog;

/**
 * task log dao
 * 
 * @author 袁兵 2012-3-27
 */
@Repository
public interface TaskLogDAO {
    /**
     * 保存记录,不管记录里面的属性是否为空
     */
    int insertSelective(TaskLog record);

    /**
     * 根据主键删除记录
     */
    int deleteByPrimaryKey(long logId);

    /**
     * 根据条件查询记录集
     */
    List<TaskLog> selectByExample(Criteria example);
    
    /**
     * 根据条件查询记录集
     */
    List<TaskLog> selectGroupTaskLog(Criteria example);

    /**
     * 根据主键查询记录
     */
    TaskLog selectByPrimaryKey(long logId);

    /**
     * 根据条件查询记录总数
     * @param criteria
     * @return
     */
    int countByExample(Criteria example);
    
    /**
     * 根据条件查询分组记录总数
     * @param example
     * @return
     */
    int countGroupTaskLogByExample(Criteria example);

    /**
     * 根据主键更新属性不为空的记录
     */
    int updateByPrimaryKeySelective(TaskLog record);
}
