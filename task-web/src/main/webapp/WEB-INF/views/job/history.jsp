<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <body>
    <script type="text/javascript">
Ext.form.Field.prototype.msgTarget = 'side';

Ext.onReady(function() {
	
    var store = new Ext.data.Store({
    	id:'groupStore',
    	storeId:'groupStore',
    	baseParams : {
			start : 0,
			limit : 20
		},
        proxy: new Ext.data.HttpProxy({
           method: 'post',
           timeout:300000,
           url: '${ctx}/job/log/all'
        }),
        reader: new Ext.data.JsonReader({
           root: 'rows',
           totalProperty: 'totalCount'
        },[{name:'logId'},
           {name:'taskId'},
           {name:'status'},
           {name:'startTime'},
           {name:'endTime'},
           {name:'resultDesc'}]),
        sortInfo: {field: "logId",direction: 'desc' },
        autoLoad: {params : {start : 0,limit : rowsPerPage}},
        remoteSort : true,
		 listeners :{   
             'beforeload':function(el,options){ 
                 Ext.apply(el.baseParams, {taskId:Ext.getCmp('taskId').getValue()});    
             }   
         }
		
    });
    
     
  //每页显示行数选择器
   var selRowsPerPage = new Ext.form.ComboBox({   
   	   store: new Ext.data.SimpleStore({   
   	       fields: ['value','text'],   
   	       data :  pageSizeStore  
   	   }),   
          displayField:'text',   
          valueField:'value',   
          typeAhead: true,   
          mode: 'local',   
          triggerAction: 'all',   
          value:rowsPerPage,
          width:80,   
          editable: false,
          selectOnFocus:true,
     	   listeners :{ 
         'select':function(e){
        	 pagebar.pageSize = parseInt(e.getValue());  
             store.load({params:{start:0,limit:pagebar.pageSize}}); 
         }
     	   }
      });  

   //分页工具栏
   var pagebar = new Ext.PagingToolbar({
   	   pageSize:rowsPerPage,
   	   store: store,
   	   displayInfo: true,
       displayMsg: '当前显示记录: {0} - {1} 共计: {2}',
       emptyMsg: '没有记录可以显示'
   });
    var sm = new Ext.grid.CheckboxSelectionModel();
    var grid = new Ext.grid.GridPanel({
    	id:'${param.id}'+'_panel',
	    renderTo:'${param.id}',
        iconCls:'tb_title',
        title: 'LOG详细信息[双击行查看任务调度历史]',
        region:'center',
        viewConfig: {
            forceFit: true
        },
	    columns: [
            new Ext.grid.RowNumberer(),
            //sm,
            {id:'logId',header: 'LogId', width: 90, sortable: true, dataIndex: 'logId'},
            {header: 'TaskID', width: 90, sortable: true, dataIndex: 'taskId'},
            {header: '执行状态 ', width: 90, sortable: true, dataIndex: 'status',renderer:taskStatus},
            {header: '开始时间 ', width: 130, sortable: true, dataIndex: 'startTime',renderer:formateTime},
            {header: '结束时间 ', width: 130, sortable: true, dataIndex: 'endTime',renderer:formateTime},
            {header: '执行时间 ', width: 130, sortable: true, renderer:executeTime},
            {header: '备注', width: 190, sortable: true, dataIndex: 'resultDesc'},
            {
            	header: '操作 ',
                xtype: 'actioncolumn',
                width: 100,
                align:'center',
                items: [{
                    icon   : '${ctx}/resources/images/delete.png',  // Use a URL in the icon config
                    tooltip: '删除',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        Ext.Ajax.request({
     					   url: '${ctx}/job/log/delete',
     					   params: {logId:rec.get('logId')},
     					   success : function(response,options) {
     					         Ext.MessageBox.show({
     				               title: '提示',
     				               msg: '成功删除！',
     				               width: 260,
     				               buttons: Ext.MessageBox.OK,
     				               icon: Ext.MessageBox.INFO
     				             });
     				             grid.getStore().reload();
     				       },
     				       failure : function(response,options) {
     				         var respText = Ext.util.JSON.decode(response.responseText); 
     				         var msg = respText.msg;
     				         Ext.MessageBox.show({
     			                title: '提示',
     			                msg: msg,
     			                width: 260,
     			                buttons: Ext.MessageBox.OK,
     			                icon: Ext.MessageBox.INFO
     				         });
     				      }
     		          });
                    }
                }]
            }
        ],
        sm:sm,
        store: store,
	    stripeRows: true,
        loadMask: {msg:'正在加载数据...'},
//         autoExpandColumn: 'logId',
        margins: '2 2 2 2',
        height:Ext.getCmp("tabs").getHeight()-30,
        bbar:['-',{xtype:'label',text:'每页显示：'},'-',selRowsPerPage,'->','-',pagebar],
        tbar:['-',{xtype:'label',text:'任务ID：'},{
			xtype : 'textfield',
			id:'taskId',
			width:100
		},'-',{
			text : '查询',
			iconCls : 'search_btn',
			active:true,
			handler : function() {
				store.load({params:{start:0,limit:pagebar.pageSize}}); 
			}
		}],
        listeners :{ 
		       'rowdblclick':function(grid, rowindex, e){
		           	grid.getSelectionModel().each(function(rec){      
				       showGroupHistoryList(rec);
				   });  
		       }
		    }

    });
 });

function restartTask(rowIndex,gridId){
	//alert(rowIndex+"|"+gridId);
	var store = gridId?Ext.getCmp("logGridHistoryPanel").getStore():Ext.getCmp('${param.id}'+'_panel').getStore();
	Ext.Ajax.request({
		   url: ctx+'/job/log/restart',
		   params: {logId:store.getAt(rowIndex).get('logId')},
		   success : function(response,options) {
		         Ext.MessageBox.show({
	               title: '提示',
	               msg: '成功再次调用任务'+store.getAt(rowIndex).get('taskId')+'！',
	               width: 260,
	               buttons: Ext.MessageBox.OK,
	               icon: Ext.MessageBox.INFO
	             });
		         store.reload();
	       },
	       failure : function(response,options) {
	         var respText = Ext.util.JSON.decode(response.responseText); 
	         var msg = respText.msg;
	         Ext.MessageBox.show({
              title: '提示',
              msg: msg,
              width: 260,
              buttons: Ext.MessageBox.OK,
              icon: Ext.MessageBox.INFO
	         });
	      }
    });
}

function showGroupHistoryList(record){
	var historyStore = new Ext.data.Store({
		id:'historyStore',
		storeId:'historyStore',
    	baseParams : {
			start : 0,
			limit : 20
		},
        proxy: new Ext.data.HttpProxy({
           method: 'post',
           timeout:300000,
           url: '${ctx}/job/log/grouplist'
        }),
        reader: new Ext.data.JsonReader({
           root: 'rows',
           totalProperty: 'totalCount'
        },[{name:'logId'},
           {name:'taskId'},
           {name:'status'},
           {name:'startTime'},
           {name:'endTime'},
           {name:'resultDesc'}]),
        sortInfo: {field: "startTime",direction: 'desc' },
        autoLoad: {params : {start : 0,limit : rowsPerPage}},
        remoteSort : true,
		 listeners :{   
             'beforeload':function(el,options){ 
                 Ext.apply(el.baseParams, {taskId:record.get('taskId')});    
             }   
         }
		
    });
    
     
  //每页显示行数选择器
   var historySelRowsPerPage = new Ext.form.ComboBox({   
   	   store: new Ext.data.SimpleStore({   
   	       fields: ['value','text'],   
   	       data :  pageSizeStore  
   	   }),   
          displayField:'text',   
          valueField:'value',   
          typeAhead: true,   
          mode: 'local',   
          triggerAction: 'all',   
          value:rowsPerPage,
          width:80,   
          editable: false,
          selectOnFocus:true,
     	   listeners :{ 
         'select':function(e){
        	 pagebar.pageSize = parseInt(e.getValue());  
        	 historyStore.load({params:{start:0,limit:pagebar.pageSize}}); 
         }
     	   }
      });  

   //分页工具栏
   var pagebar = new Ext.PagingToolbar({
   	   pageSize:rowsPerPage,
   	   store: historyStore,
   	   displayInfo: true,
       displayMsg: '当前显示记录: {0} - {1} 共计: {2}',
       emptyMsg: '没有记录可以显示'
   });
    var sm = new Ext.grid.CheckboxSelectionModel();
    var grid = new Ext.grid.GridPanel({
    	id:'logGridHistoryPanel',
        iconCls:'tb_title',
        title: record.get('taskId')+'任务调度历史记录',
        region:'center',
        viewConfig: {
            forceFit: true
        },
	    columns: [
            new Ext.grid.RowNumberer(),
            //sm,
            {id:'logId',header: 'LogId', width: 90, sortable: true, dataIndex: 'logId'},
            {header: 'TaskID', width: 90, sortable: true, dataIndex: 'taskId'},
            {header: '执行状态 ', width: 90, sortable: true, dataIndex: 'status',renderer:taskHistoryStatus},
            {header: '开始时间 ', width: 130, sortable: true, dataIndex: 'startTime',renderer:formateTime},
            {header: '结束时间 ', width: 130, sortable: true, dataIndex: 'endTime',renderer:formateTime},
            {header: '执行时间 ', width: 130, sortable: true, renderer:executeTime},
            {header: '备注', width: 190, sortable: true, dataIndex: 'resultDesc'},
            {
            	header: '操作 ',
                xtype: 'actioncolumn',
                width: 100,
                align:'center',
                items: [{
                    icon   : '${ctx}/resources/images/delete.png',  // Use a URL in the icon config
                    tooltip: '删除',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = historyStore.getAt(rowIndex);
                        Ext.Ajax.request({
     					   url: '${ctx}/job/log/delete',
     					   params: {logId:rec.get('logId')},
     					   success : function(response,options) {
     					         Ext.MessageBox.show({
     				               title: '提示',
     				               msg: '成功删除！',
     				               width: 260,
     				               buttons: Ext.MessageBox.OK,
     				               icon: Ext.MessageBox.INFO
     				             });
     				             grid.getStore().reload();
     				       },
     				       failure : function(response,options) {
     				         var respText = Ext.util.JSON.decode(response.responseText); 
     				         var msg = respText.msg;
     				         Ext.MessageBox.show({
     			                title: '提示',
     			                msg: msg,
     			                width: 260,
     			                buttons: Ext.MessageBox.OK,
     			                icon: Ext.MessageBox.INFO
     				         });
     				      }
     		          });
                    }
                }]
            }
        ],
        sm:sm,
        store: historyStore,
	    stripeRows: true,
        loadMask: {msg:'正在加载数据...'},
//         autoExpandColumn: 'logId',
        margins: '2 2 2 2',
        height:Ext.getCmp("tabs").getHeight()-30,
        bbar:['-',{xtype:'label',text:'每页显示：'},'-',historySelRowsPerPage,'->','-',pagebar]
    });
    
    var win = new Ext.Window({
		layout : 'border',
		width : 700,
		height : 500,				
		modal : true,
        plain: true,
        maximizable : true,
        //minimizable : true,
        closeAction:'hide',
		items : grid,
		buttons : [ {
			text : '关闭',
			iconCls : 'close_btn',
			width:45,
			handler : function() {
				win.close();
			}
		}]
	}).show();
}

 </script>
 <div id='${param.id}'></div>
  </body>
</html>