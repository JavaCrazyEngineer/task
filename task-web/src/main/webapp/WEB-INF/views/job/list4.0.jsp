<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<%-- <%@ include file="../commons/exthead.jsp"%> --%>
  <body>
    <script type="text/javascript">
 Ext.onReady(function() {
    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
           method: 'post',
           timeout:300000,
           url: '${ctx}/hello.jsp'
        }),
        reader: new Ext.data.JsonReader({
           root: 'items',
           totalProperty: 'totalCount'
        },[{name:'accessTime'},{name:'machineId'},{name:'userName'},{name:'mobile'},{name:'city'},{name:'district'},{name:'address'}]),
        sortInfo: {field: "machineId",direction: 'asc' }
    });
    
    var pageSizeStore = new Ext.data.SimpleStore({   
        fields: ['pageSizeValue','pageSizeItem'],   
        data : [[20,'20条'],[50,'50条'],[100,'100条'],[200,'200条']]   
    }); 
    //创建选择每页数目的combox   
    var cmPageSize = new Ext.form.ComboBox({   
        store: pageSizeStore,   
        displayField:'pageSizeItem',   
        valueField:'pageSizeValue',   
        typeAhead: true,   
        mode: 'local',   
        triggerAction: 'all',   
        value:20,
        width:60,   
        editable: false,
        selectOnFocus:true
    });  
    selPageSize = 20;
    var pagbar = new Ext.PagingToolbar({
    	    pageSize:selPageSize,
    	    store: store,
    	    displayInfo : true,   
    	    emptyMsg: '未查询到任何记录！'
    });
    cmPageSize.on('select',function(e){
        selPageSize = parseInt(e.getValue());
        store.reload();
    }); 
    
    var bbar = new Ext.PagingToolbar({
    	    pageSize:selPageSize,
    	    store: store,
    	    displayInfo : true,   
    	    emptyMsg: '未查询到任何记录！'
    });
    bbar = ['-',{xtype:'label',text:'每页显示：'},cmPageSize,'-','->',pagbar];
    
    var grid = new Ext.grid.GridPanel({
        iconCls:'tb_title',
        title: '用户的详细信息',
        region:'center',
        renderTo:'grid',
	    columns: [
            new Ext.grid.RowNumberer(),
            {header: '访问时间', width: 150, sortable: true, dataIndex: 'accessTime'},
            {header: '机顶盒号', width: 150, sortable: true, dataIndex: 'machineId'},
            {header: '姓名', width: 240, sortable: true, dataIndex: 'userName'},
            {header: '联系电话', width: 140, sortable: true, dataIndex: 'mobile'},
            {header: '所在城区', width: 110, sortable: true, dataIndex: 'city'},
            {header: '小区名称', width: 110, sortable: true, dataIndex: 'district'},
            {id:'address',header: '详细地址', width: 300, sortable: true, dataIndex: 'address'}
        ],
        store: [],
	    stripeRows: true,
        loadMask: {msg:'正在加载数据...'},
        autoExpandColumn: 'address',
        margins: '2 2 2 2',
        bbar : bbar,
        tbar:['-',{
            text:'新增',
            iconCls:'add_btn',
            handler:function(){
                grid.exportExcel();
            }
        },'-',{
            text:'删除',
            iconCls:'del_btn',
            handler:function(){
                grid.exportWord();
            }
        }]
    });
    setTimeout(function(){
// 	   store.load();		
	},100)
    
	var viewport = new Ext.Viewport({
        layout:'border',
        margins: '2 0 0 0',
        items:[grid]
    });
 });
 </script>
 <div id="grid"></div>
  </body>
</html>