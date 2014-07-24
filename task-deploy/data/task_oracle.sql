/*==============================================================*/
/* DBMS name:      ORACLE Version 10g                           */
/* Created on:     2012/3/21 17:27:51                           */
/*==============================================================*/

--drop trigger QUARTZ."tib_task_config";
--drop trigger QUARTZ."tib_task_log";

drop table QUARTZ.task_config;
drop table QUARTZ.task_log;

drop sequence QUARTZ."SEQ_TASK_CONFIG_ID";
drop sequence QUARTZ."SEQ_TASK_LOG_ID";

create sequence QUARTZ."SEQ_TASK_CONFIG_ID"
increment by 1
start with 100000
 maxvalue 99999999
 minvalue 100000
nocycle
 cache 64
order
/

create sequence QUARTZ."SEQ_TASK_LOG_ID"
increment by 1
start with 200000
 maxvalue 99999999
 minvalue 100000
nocycle
 cache 64
order
/
CREATE TABLE QUARTZ.task_config
  (
    TASK_ID NUMBER(10) NOT NULL,
    TRIGGER_NAME  VARCHAR2(250) NOT NULL,
    TRIGGER_GROUP VARCHAR2(250) NOT NULL,
    TRIGGER_URL VARCHAR2(500) NOT NULL,
    PRIMARY KEY (TASK_ID)
);
CREATE TABLE QUARTZ.task_log
  (
    LOG_ID NUMBER(10) NOT NULL,
    TASK_ID  NUMBER(10) NOT NULL,
    STATUS VARCHAR2(10) NOT NULL,
    RESULT_DESC VARCHAR2(250) NULL,
    START_TIME   TIMESTAMP NOT NULL, 
    END_TIME TIMESTAMP NULL,
    PRIMARY KEY (LOG_ID)
);

commit;