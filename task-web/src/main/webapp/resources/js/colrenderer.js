/**
 * 用于定义需要渲染的列
 */
//日期格式字符串
var date_formate_Y_m_d = 'Y-m-d';
var date_formate_Y_m_d_H_s_i = 'Y-m-d H:i:s';

/**
 * 年月日格式化函数
 * @param val
 * @returns
 */
function formateDate(val){
	return new Date(val).format(date_formate_Y_m_d);;
}

/**
 * 年月日时分秒格式化函数
 * @param val
 * @returns
 */
function formateTime(val){
	return new Date(val).format(date_formate_Y_m_d_H_s_i);;
}

function executeTime(value,meta,record,rowIndex,colIndex,store){
	var status = record.get("status");
	var startTime = record.get("startTime");
	var endTime = record.get("endTime");
	if (status == 'START') {
        return '';
    } else {
        return '<span style="color:blue;">'+(endTime-startTime)+'ms</span>';
    }
}

/**
 * trigger状态渲染函数
 * @param val
 * @returns
 */
function triggerState(val) {
    if (val == 'ACQUIRED') {
        return '<div style="background-color:#33FF00;text-align:center;">运行中</div>';
    } else if(val == 'PAUSED'){
        return '<div style="background-color:#CC6600;text-align:center;">暂停中</div>';
    }else if(val == 'WAITING'){
        return '<div style="background-color:#9999FF;text-align:center;">等待中</div>';
    }
    return val;
}

/**
 * task执行状态
 * @param val
 * @returns
 */
function taskStatus(value,meta,record,rowIndex,colIndex,store) {
	//console.log("store:["+store.storeId+"]");
    if (value == 'START') {
        return '<div style="background-color:#CC6600;text-align:center;">执行中</div>';
    } else if(value == 'END'){
        return '<div style="background-color:#33FF00;text-align:center;">执行成功</div>';
    }else if(value == 'FAILURE'){
        return '<div style="background-color:red;text-align:center;">执行失败&nbsp;&nbsp;<a href="javascript:restartTask('+rowIndex+');"><img style="vertical-align: middle;" ext:qtip="再次调用" src="'+ctx+'/resources/images/start.gif"/></a></div>';
    }
    return value;
}

/**
 * task执行状态
 * @param val
 * @returns
 */
function taskHistoryStatus(value,meta,record,rowIndex,colIndex,store) {
	//console.log("store:["+store.storeId+"]");
    if (value == 'START') {
    	return '<div style="background-color:#CC6600;text-align:center;">执行中</div>';
    } else if(value == 'END'){
    	return '<div style="background-color:#33FF00;text-align:center;">执行成功</div>';
    }else if(value == 'FAILURE'){
        return '<div style="background-color:red;text-align:center;">执行失败&nbsp;&nbsp;<a href=javascript:restartTask('+rowIndex+',"0");><img style="vertical-align: middle;" ext:qtip="再次调用" src="'+ctx+'/resources/images/start.gif"/></a></div>';
    }
    return value;
}
