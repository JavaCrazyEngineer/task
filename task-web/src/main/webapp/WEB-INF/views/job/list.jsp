<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<%-- <%@ include file="../commons/exthead.jsp"%> --%>
  <body>
    <script type="text/javascript">
Ext.form.Field.prototype.msgTarget = 'side';
var groupCombo = new Ext.form.ComboBox({
	fieldLabel : 'Trigger Group',
	hiddenName : 'triggerGroup',
	name : 'triggerGroup',
	triggerAction : 'all',
	emptyText:'请选择...',
	mode : 'local',
	store : new Ext.data.ArrayStore({
				fields : ['v', 't'],
				data : querytriggerGroupArray
			}),
	valueField : 'v',
	displayField : 't',
	allowBlank : true,
	editable : false,
	anchor : '95%'
}); 

Ext.onReady(function() {
	
    var store = new Ext.data.Store({
    	baseParams : {
			start : 0,
			limit : 20
		},
        proxy: new Ext.data.HttpProxy({
           method: 'post',
           timeout:300000,
           url: '${ctx}/job/manager/all'
        }),
        reader: new Ext.data.JsonReader({
           root: 'rows',
           totalProperty: 'totalCount'
        },[{name:'taskId'},
           {name:'triggerUrl'},
           {name:'triggerName'}, 
           {name:'triggerGroup'},
           {name:'nextFireTime'},
           {name:'prevFireTime'},
           {name:'priority'},
           {name:'triggerState'},
           {name:'triggerType'},
           {name:'startTime'},
           {name:'endTime'},
           {name:'cronExpression'}]),
        sortInfo: {field: "triggerGroup",direction: 'asc' },
        autoLoad: {params : {start : 0,limit : rowsPerPage}},
        remoteSort : true,
		 listeners :{   
             'beforeload':function(el,options){ 
                 Ext.apply(el.baseParams, {triggerName:Ext.getCmp('triggerName').getValue(),triggerGroup:groupCombo.getValue()});    
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
        title: '用户的详细信息',
        region:'center',
        viewConfig: {
            forceFit: true
        },
	    columns: [
            new Ext.grid.RowNumberer(),
            sm,
            {id:'taskId',header: 'TaskID', width: 90, sortable: true, dataIndex: 'taskId'},
            {header: 'Trigger名称', width: 90, sortable: true, dataIndex: 'triggerName'},
            {header: 'Trigger分组', width: 90, sortable: true, dataIndex: 'triggerGroup'},
            {header: '下次执行时间', width: 130, sortable: true, dataIndex: 'nextFireTime',renderer:formateTime},
            {header: '上次执行时间 ', width: 130, sortable: true, dataIndex: 'prevFireTime',renderer:formateTime},
            {header: '优先级', width: 50, sortable: true, dataIndex: 'priority'},
            {header: 'Trigger状态 ', width: 90, sortable: true, dataIndex: 'triggerState',renderer:triggerState},
            {header: 'Trigger类型', width: 90, sortable: true, dataIndex: 'triggerType'},
            {header: '开始时间 ', width: 130, sortable: true, dataIndex: 'startTime',renderer:formateTime},
            {header: '结束时间 ', width: 130, sortable: true, dataIndex: 'endTime',renderer:formateTime},
            {header: '调用URL ', width: 190, sortable: true, dataIndex: 'triggerUrl'},
            {header: 'Cron表达式',hidden:true, sortable: true, dataIndex: 'cronExpression'},
            {
            	header: '操作 ',
                xtype: 'actioncolumn',
                width: 100,
                align:'center',
                items: [{
                    icon   : '${ctx}/resources/images/suspend.gif',  // Use a URL in the icon config
                   style:'padding-right:5px',
                    tooltip: '暂停',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        Ext.Ajax.request({
      					   url: '${ctx}/job/manager/suspend',
      					   params: {taskId:rec.get('taskId')},
      					   success : function(response,options) {
      					         Ext.MessageBox.show({
      				               title: '提示',
      				               msg: '成功暂停分组：'+rec.get('triggerGroup')+'下'+rec.get('triggerName')+'任务！',
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
                }, {
                    icon   : '${ctx}/resources/images/tbar_synchronize.png',  // Use a URL in the icon config
                    tooltip: '重启',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        Ext.Ajax.request({
       					   url: '${ctx}/job/manager/resume',
       					   params: {taskId:rec.get('taskId')},
       					   success : function(response,options) {
       					         Ext.MessageBox.show({
       				               title: '提示',
       				               msg: '成功重启分组：'+rec.get('triggerGroup')+'下'+rec.get('triggerName')+'任务！',
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
                }, {
                    icon   : '${ctx}/resources/images/start.gif',  // Use a URL in the icon config
                    tooltip: '立刻调用',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        Ext.Ajax.request({
       					   url: '${ctx}/job/manager/immediatelyCall',
       					   params: {taskId:rec.get('taskId')},
       					   success : function(response,options) {
       					         Ext.MessageBox.show({
       				               title: '提示',
       				               msg: '成功调用分组：'+rec.get('triggerGroup')+'下'+rec.get('triggerName')+'任务！',
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
                },{
                    icon   : '${ctx}/resources/images/delete.png',  // Use a URL in the icon config
                    tooltip: '删除',
                    handler: function(grid, rowIndex, colIndex) {
                        var rec = store.getAt(rowIndex);
                        Ext.MessageBox.show({
	    			        title: '提示',
	    			        msg: '确定要删除定时任务吗？',
	    			        width: 270,
	    			        fn:confirmResult,
	    			        buttons: Ext.MessageBox.YESNO,
	    			        icon: Ext.MessageBox.QUESTION
	    			    });
	    			    function confirmResult(btn){
	    	                if(btn == 'yes'){
	    	                	Ext.Ajax.request({
	    	     					   url: '${ctx}/job/manager/delete',
	    	     					   params: {taskId:rec.get('taskId')},
	    	     					   success : function(response,options) {
	    	     					         Ext.MessageBox.show({
	    	     				               title: '提示',
	    	     				               msg: '成功删除分组：'+rec.get('triggerGroup')+'下'+rec.get('triggerName')+'任务！',
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
	    			    }
                        
                    }
                }]
            }
        ],
        sm:sm,
        store: store,
	    stripeRows: true,
        loadMask: {msg:'正在加载数据...'},
//         autoExpandColumn: 'triggerName',
        margins: '2 2 2 2',
        height:Ext.getCmp("tabs").getHeight()-30,
        bbar:['-',{xtype:'label',text:'每页显示：'},'-',selRowsPerPage,'->','-',pagebar],
        tbar:['-',{
			text : '新建',
			iconCls : 'add_btn',
			handler : function() {
				initFormWindow(grid);
				formWindow.setIconClass('add_btn'); // 设置窗口的样式
				formWindow.setTitle('新增任务'); // 设置窗口的名称
				formPanel.getForm().reset();
				formWindow.show();		
			}
		},'-',{
			text : '修改',
			iconCls : 'edit_btn',
			handler : function() {
				initFormWindow(grid);
				formWindow.setIconClass('edit_btn'); // 设置窗口的样式
				formWindow.setTitle('修改任务'); // 设置窗口的名称
				formPanel.getForm().reset();
				loadData2FormPanel();
			}
		},'-',{xtype:'label',text:'任务名称：'},{
			xtype : 'textfield',
			id:'triggerName',
			width:100
		},'-',{xtype:'label',text:'任务分组：'},groupCombo,'-',{
			text : '查询',
			iconCls : 'search_btn',
			active:true,
			handler : function() {
				store.load({params:{start:0,limit:pagebar.pageSize}}); 
			}
		}]
    });
 });

 var formPanel ;
 var formWindow;
 function initFormWindow(grid){
// 	/** 基本信息-详细信息的form */
	formPanel = new Ext.form.FormPanel({
		frame : true,
		bodyStyle : 'padding:10px 10px 10px 5px;',
		labelwidth : 50,
		labelAlign : 'right',
		region:'center',
		defaultType : 'textfield',
		margins: '2 2 2 2',
		items : [{
					xtype : 'hidden',
					fieldLabel : 'ID',
					name : 'taskId',
					anchor : '95%'
				},{
					fieldLabel : 'Trigger 名称',
					maxLength : 64,
					
					allowBlank : false,
					name : 'triggerName',
					anchor : '95%'
				},new Ext.form.ComboBox({
					fieldLabel : 'Trigger Group',
					hiddenName : 'triggerGroup',
					name : 'triggerGroup',
					triggerAction : 'all',
					emptyText:'请选择...',
					mode : 'local',
					store : new Ext.data.ArrayStore({
								fields : ['v', 't'],
								data : triggerGroupArray
							}),
					valueField : 'v',
					displayField : 't',
					allowBlank : false,
					editable : false,
					anchor : '95%'
				}),{
					fieldLabel : 'Cron 表达式',
					maxLength : 64,
					allowBlank : false,
					name : 'cronExpression',
					anchor : '95%'
				},{
					xtype:'label',
					style:'color:red;padding-left:40px;padding-top:10px',
					text:'Cron表达式(如"0/10 * * ? * * *"，每10秒中执行调试一次)'
				},{
					fieldLabel : '任务调用URL',
					maxLength : 64,
					allowBlank : false,
					name : 'triggerUrl',
					anchor : '95%'
				}]
	});
	
// 	/** 编辑新建窗口 */
	formWindow = new Ext.Window({
				layout : 'border',
				width : 500,
				height : 210,				
				modal : true,
				resizable:false,
		        plain: true,
		        closeAction:'hide',
				items : formPanel,
				buttons : [{
					text : '保存',
					iconCls : 'sure_btn',
					width:45,
					handler : function() {
						if(formPanel.form.isValid()){
		                      formPanel.form.submit({
		                          url:'${ctx}/job/manager/save', 
		                          waitTitle:'提示',
		                          method: 'POST',
		                          waitMsg:'正在处理,请稍候.....',
		                          success:function(form,action){
		                        	  console.log('save result:['+action.result.success+']'); 
		                              console.log('save msg:['+action.result.message+']');
		                              Ext.MessageBox.show({
							               title: '提示',
							               msg: '保存成功！',
							               width: 230,
							               buttons: Ext.MessageBox.OK,
							               icon: Ext.MessageBox.INFO
						              });
		                              formWindow.close();
		                              formPanel.getForm().reset();
		                           // 清空选中的记录
		                              grid.getSelectionModel().clearSelections();
						              Ext.getCmp('${param.id}'+'_panel').getStore().reload();				              
		                          },
		                          failure:function(form,action){
// 		                        	  console.log('save result:['+action.result.success+']'); 
// 		                              console.log('save msg:['+action.result.message+']');
// 						              new Ext.Window({
// 											layout : 'border',
// 											width : 400,
// 											height : 180,				
// 											title : "异常信息",
// 											iconCls : 'error_btn',
// 											modal : true,
// 											resizable:false,
// 									        plain: true,
// 									        items: [new Ext.form.Label({
// 								                html: '<div style="padding:5px;">' + action.result.message + '</div>'
// 								            }), new Ext.Panel({
// 								                title: '详细信息',
// 								                // bodyStyle:'overflow-x:visible;overflow-y:scroll;',
// 								                // bodyStyle:'overflow-x:hidden;;overflow-y:scroll;',
// 								                //collapsible: true,
// 								                //collapsed: true,
// 								                autoScroll: true,
// 								                region:'center',
// 								                height: 200,
// 								                html: action.result.message
// 								            })]
// 										}).show();
// 						              formWindow.close();
// 		                              formPanel.getForm().reset();
// 						              Ext.getCmp('${param.id}'+'_panel').getStore().reload();
		                        	  var json = action.result;
	                                	 if(json.errorCode=='error.save.trigger'){
	               	        			   handleException('${ctx}/exception',json.message);
	               	        			   return;
	                	        		 }
		                          }
		                     });
			               }
					}
				}, {
					text : '重置',
					iconCls : 'reset_btn',
					width:45,
					handler : function() {
						var form = formPanel.getForm();
						form.reset();
					}
				}]
			});
	
 }
 
 function loadData2FormPanel(){
	var record = Ext.getCmp('${param.id}'+'_panel').getSelectionModel().getSelected();
	if(record){
		formPanel.getForm().loadRecord(record);
		formWindow.show();
	}else{
		Ext.MessageBox.show({
            title: '提示',
            msg: '请选择需要修改的记录！',
            width: 230,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO
       });
	}
 }
 </script>
 <div id='${param.id}'></div>
  </body>
</html>