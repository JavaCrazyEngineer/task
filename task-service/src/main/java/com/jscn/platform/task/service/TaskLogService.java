/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.service;

import java.util.List;

import com.jscn.commons.core.mybatis.Criteria;
import com.jscn.platform.task.dmo.TaskLog;

/**
 * 请输入功能描述
 *
 * @author 袁兵  2012-3-27
 */
public interface TaskLogService {
    /**
     * 根据条件查询记录集
     * @param criteria
     * @return
     */
    public List<TaskLog> findTaskLogsByCriteria(Criteria criteria);
    
    /**
     * 查询分组log，每个分组显示最新的一条log记录
     * @param criteria
     * @return
     */
    public List<TaskLog> findGroupTaskLogsByCriteria(Criteria criteria);

    /**
     * 根据条件查询记录总数
     * @param criteria
     * @return
     */
    public int getTaskLogsCountByCriteria(Criteria criteria);
    
    /**
     * 根据条件查询分组记录总数
     * @param criteria
     * @return
     */
    public int getGroupTaskLogsCountByCriteria(Criteria criteria);
    
    /**
     * 根据logId查询TaskLog
     * @param logId
     * @return
     */
    public TaskLog getTaskLogById(Long logId);
    
    /**
     * 修改TaskLog
     * @param taskLog
     */
    public void editTaskLog(TaskLog taskLog);
    
    /**
     * 记录TaskLog回执
     * @param taskLog
     */
    public void receipt(Long logId,int result,String desc);
    
    /**
     * 删除TaskLog
     * @param taskId
     */
    public void removeTaskLog(Long logId);
    
    /**
     * 重新执行任务
     * @param logId
     */
    public void restartTask(Long logId);
}
