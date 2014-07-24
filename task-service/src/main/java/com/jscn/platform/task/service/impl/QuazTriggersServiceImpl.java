/**
 * JSCN APPLIANCE CHAINS.
 * Copyright (c) 2012-2012 All Rights Reserved.
 */
package com.jscn.platform.task.service.impl;

import static org.quartz.CronScheduleBuilder.cronSchedule;
import static org.quartz.TriggerBuilder.newTrigger;

import java.text.ParseException;
import java.util.List;

import org.quartz.CronExpression;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.jscn.commons.core.mybatis.Criteria;
import com.jscn.platform.task.dao.QuazTriggersDAO;
import com.jscn.platform.task.dao.TaskConfigDAO;
import com.jscn.platform.task.dmo.QuazTriggers;
import com.jscn.platform.task.dmo.TaskConfig;
import com.jscn.platform.task.service.QuazTriggersService;
import com.jscn.platform.task.service.SimpleJobService;
import com.jscn.platform.task.util.TriggerStatusEnum;

/**
 * quaz trigger service
 * 
 * @author 袁兵 2012-3-14
 */
@Service
public class QuazTriggersServiceImpl implements QuazTriggersService {

	Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	QuazTriggersDAO quazTriggersDAO;

	@Autowired
	TaskConfigDAO taskConfigDAO;

	@Autowired
	SimpleJobService simpleJobService;

	@Autowired
	@Qualifier("quartzScheduler")
	private Scheduler scheduler;

	@Autowired
	@Qualifier("jobDetail")
	private JobDetail jobDetail;

	/**
	 * {@inheritDoc}
	 */
	@Override
	public List<QuazTriggers> findQuazTriggersByCriteria(Criteria criteria) {
		return quazTriggersDAO.findByCriteria(criteria);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public int getQuazTriggersCountByCriteria(Criteria criteria) {
		return quazTriggersDAO.countByCriteria(criteria);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public QuazTriggers getQuazTriggerByTriggerNameAndGroup(String triggerName,
			String triggerGroup) {
		return quazTriggersDAO.getQuazTriggerByTriggerNameAndGroup(triggerName,
				triggerGroup);
	}

	/**
	 * {@inheritDoc}
	 */
	@SuppressWarnings("unused")
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = { Exception.class })
	public int addTrigger(TaskConfig taskConfig, String cronExpression) {
		int taskId = taskConfigDAO.insert(taskConfig);

		// 新增quartz 任务
		addQuazTrigger(taskConfig.getTriggerName(),
				taskConfig.getTriggerGroup(), cronExpression);
		return taskId;

	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public QuazTriggers getQuazTriggerByTaskId(long taskId) {
		return quazTriggersDAO.getQuazTriggerByTaskId(taskId);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED, rollbackFor = { Exception.class })
	public void editTrigger(TaskConfig taskConfig, String cronExpression) {
		TaskConfig oldConfig = taskConfigDAO.selectByPrimaryKey(taskConfig
				.getTaskId());
		// 修改任务cron TODO:是否需要判断cronExpression是否修改过，再进行修改
		editTriggerCron(oldConfig, taskConfig, cronExpression);

		// 修改任务调用URL
		taskConfigDAO.updateByPrimaryKeySelective(taskConfig);

	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void editTriggerUrl(long taskId, String triggerUrl) {
		TaskConfig taskConfig = taskConfigDAO.selectByPrimaryKey(taskId);
		taskConfigDAO.updateByPrimaryKeySelective(taskConfig);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void editTriggerCron(long taskId, String cronExpression) {
		TaskConfig taskConfig = taskConfigDAO.selectByPrimaryKey(taskId);

		editTriggerCron(taskConfig, taskConfig, cronExpression);
	}

	/**
	 * 修改任务运行cron
	 * 
	 * @param taskConfig
	 * @param cronExpression
	 */
	private void editTriggerCron(TaskConfig oldConfig, TaskConfig newConfig,
			String cronExpression) {
		// TODO:可以看cronExpression是否发生修改，来判断是否需要重建trigger
		// 先删除老的quartz trigger
		removeQuazTrigger(oldConfig.getTriggerName(),
				oldConfig.getTriggerGroup());
		// 再增加新的quartz trigger
		addQuazTrigger(newConfig.getTriggerName(), newConfig.getTriggerGroup(),
				cronExpression);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void removeTrigger(long taskId) {
		TaskConfig taskConfig = taskConfigDAO.selectByPrimaryKey(taskId);

		// 先删除quartz trigger
		removeQuazTrigger(taskConfig.getTriggerName(),
				taskConfig.getTriggerGroup());

		// 再删除自定义的config TODO:是否要删除，要不要保持一个历史记录?
		taskConfigDAO.deleteByPrimaryKey(taskId);
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void pauseTrigger(long taskId) {
		TaskConfig taskConfig = taskConfigDAO.selectByPrimaryKey(taskId);
		pauseQuazTrigger(taskConfig.getTriggerName(),
				taskConfig.getTriggerGroup());
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void resumeTrigger(long taskId) {
		TaskConfig taskConfig = taskConfigDAO.selectByPrimaryKey(taskId);
		resumeQuazTrigger(taskConfig.getTriggerName(),
				taskConfig.getTriggerGroup());
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void immediatelyCall(long taskId) {
		TaskConfig taskConfig = taskConfigDAO.selectByPrimaryKey(taskId);
		simpleJobService.doJob(taskConfig);
	}

	/**
	 * 新增quartz任务
	 * 
	 * @param triggerName
	 * @param triggerGroup
	 * @param cronExpression
	 * @throws SchedulerException
	 * @throws ParseException
	 */
	private void addQuazTrigger(String triggerName, String triggerGroup,
			String cronExpression) {
		try {
			scheduler.addJob(jobDetail, true);
			Trigger cronTrigger = newTrigger()
					.withIdentity(triggerName, triggerGroup)
					.withSchedule(
							cronSchedule(new CronExpression(cronExpression)))
					.forJob(jobDetail.getKey().getName(),
							Scheduler.DEFAULT_GROUP).build();

			scheduler.scheduleJob(cronTrigger);
			scheduler.rescheduleJob(TriggerKey.triggerKey(cronTrigger.getKey()
					.getName(), cronTrigger.getKey().getGroup()), cronTrigger);
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		} catch (ParseException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 删除quartz任务
	 * 
	 * @param triggerName
	 * @param triggerGroup
	 * @return
	 */
	private boolean removeQuazTrigger(String triggerName, String triggerGroup) {
		try {
			// 先暂停
			pauseQuazTrigger(triggerName, triggerGroup);
			return scheduler.unscheduleJob(TriggerKey.triggerKey(triggerName,
					triggerGroup));// 移除触发器
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 重启触发器
	 * 
	 * @param triggerName
	 * @param triggerGroup
	 */
	private void resumeQuazTrigger(String triggerName, String triggerGroup) {
		try {
			scheduler.resumeTrigger(TriggerKey.triggerKey(triggerName,
					triggerGroup));
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 停止触发器
	 * 
	 * @param triggerName
	 * @param triggerGroup
	 */
	private void pauseQuazTrigger(String triggerName, String triggerGroup) {
		try {
			QuazTriggers trigger = quazTriggersDAO
					.getQuazTriggerByTriggerNameAndGroup(triggerName,
							triggerGroup);
			// 判断当前trigger是否暂停状态,不是暂停状态再暂停
			if (!TriggerStatusEnum.PAUSED.getStatusEN().equals(
					trigger.getTriggerState())) {
				scheduler.pauseTrigger(TriggerKey.triggerKey(triggerName,
						triggerGroup));
			}
		} catch (SchedulerException e) {
			throw new RuntimeException(e);
		}
	}

	@Override
	public boolean checkTaskConfigIsExist(Long taskId, String triggerName,
			String triggerGroup) {
		return taskConfigDAO.checkExistsTask(taskId, triggerName, triggerGroup)>=1?true:false;
	}

}
