    
	//页面加载遮罩  
    var loadMask = new Ext.LoadMask(Ext.getBody(), {
        msg : '正在加载 ... ',                           
        removeMask : true 
    }); 
    loadMask.show();
    
    Ext.onReady(function(){
        Ext.form.Field.prototype.msgTarget = 'qtip';
		Ext.QuickTips.init(); 
        /*var menuTree = new Ext.tree.TreePanel({
	         id:'menuTree',
		     region:'west',
		     title: '系统导航',
		     iconCls:'menu_top',
		     split: true,
	         width: 200,
	         minSize: 150,
	         maxSize: 175,
	         lines: true, 
	         collapsible: true,
	         collapseMode :'mini',
	         margins: '2 0 2 2',
		     animate:true,
		     enableDD:false,
		     autoScroll: true,
		     rootVisible: false,
		     titleCollapse : true,
		     root: new Ext.tree.AsyncTreeNode(),
		     loader: new Ext.tree.TreeLoader(),
	  	     listeners:{
	            "beforeload" : function(){
	               menuTree.loader.dataUrl = 'ajax/getMenu.jsp';
	            },
	            "load":function(){
	               loadMask.hide(); 
	            },
	            "click" : function(node,e){
	                 if(!node.leaf){
	                   return;
	                 }
	                 if(!node.attributes.url){
	                    return;
	                 }
		      	     addTab(node.text,node.attributes.url,node.id);
		      	}
	         }
		});
        menuTree.expandAll();*/
        
        var menuPanel = new Ext.tree.TreePanel({
            region: 'west',
            title: '系统导航',
		    iconCls:'menu_top',
		    animate:true,
	        collapseMode :'mini',
	        split: true,
            width: 188,
            minSize: 188,
	        maxSize: 155,
            margins: '2 0 2 2',
            border:true,
            root:[],
            html: '<iframe src="'+ctx+'/menu" frameborder="0" width="100%" height="100%" scrolling="no"></iframe>'
        });
        
       var topPanel = new Ext.Panel({
            region: 'north',
            height: 80, 
            //border:false,
            margins: '0 2 1 2',
            html: '<iframe src="'+ctx+'/top" frameborder="0" width="100%" height="100%" scrolling="no"></iframe>'
        });
        var welcomePanel = new Ext.Panel({
	         id:'tab_0000',
	         iconCls: 'icon_0010',
	         title: 'welcome',
	         html: '<iframe src="'+ctx+'/hello.jsp" name="tabIframe_0000" frameborder="0" width="100%" height="100%" onload="javascript:setTabIframeHeight(this)" scrolling="auto"></iframe>',
	         listeners:{
	            "bodyresize" : function(){
	               window.frames["tabIframe_0000"].location.href = ctx + "/hello.jsp"; 
	            }
	         }   
        });
	    var tabs = new Ext.TabPanel({
	         id:'tabs',
	         region: 'center', 
	         deferredRender: false,
	         enableTabScroll:true,
	         activeTab: 0,    
	         margins: '2 2 2 2',
	         defaults: {
                autoHeight:true,
	            autoScroll:true
	         },
	         plugins: new Ext.ux.TabCloseMenu(),
	         items: welcomePanel,
	         listeners: {
	             'bodyresize': function (panel, neww, newh) {
	            	 // 自动调整tab下面的panel的大小
	                 var tab = panel.getActiveTab();
	                 var centerPanel = Ext.getCmp(tab.id + "_div_panel");
	                 if (centerPanel) {
	                	 centerPanel.setHeight(newh - 2);
	                     centerPanel.setWidth(neww - 2);
	                 }
	             }
	         }
	    });
	    var bottomPanel = new Ext.Panel({
	         region: 'south', 
    		 height : 39,
    		 html: '<iframe src="'+ctx+'/bottom" frameborder="0" width="100%" height="100%" scrolling="no"></iframe>'
        });
	    var mainPanel = new Ext.Panel({
	        renderTo : 'mainPage',
	        layout :'border',
	        border:false,
	        region :'center',
	        items : [topPanel, menuPanel,tabs,bottomPanel]
	    });
        var viewport = new Ext.Viewport({
            layout: 'border',
            items: [mainPanel]
        });
        loadMask.hide(); 
    });
    
    function addTab(title,url,menuId){
          var tabId = menuId;
          var tabs = Ext.getCmp("tabs");
	      var tab = tabs.getItem(tabId);
	      if(tab){
             tabs.setActiveTab(tab);
	      }else{
	         var tab = tabs.add({ 
	            id:tabId,
                title:title,
                layout:'fit',
                iconCls: 'tabs',
                closable:true,
                autoScroll: true,
                autoLoad: {
                    url: url,
                    params: {id: menuId+"_div"},
                    scripts: true,
                    nocache: true
                },
		         listeners: {
	                 activate: function (panel) {
	                     //自动调节高度和宽度
	                     var inPanel = Ext.getCmp(panel.id + "_div_panel");
	                     if (inPanel) {
	                         inPanel.doLayout(true, true);
	                         inPanel.setHeight(Ext.getCmp("tabs").getInnerHeight()-1);
	                         inPanel.setWidth(panel.getWidth());
	                     }
	                 }
		         }
            }).show();
            tabs.doLayout();
         }  
	  }
	  
	   //关闭子选项卡
      function closeTab(id){
        var tabs = Ext.getCmp("tabs");
        var tab = tabs.getItem(id);
        tabs.remove(tab);
      }
      
      function setTabIframeHeight(obj){
         var tabHeight = Ext.getCmp('tabs').getHeight()-10;
         if(Ext.isIE8){
            obj.height = tabHeight - 28;
         }else if(Ext.isIE7){
            obj.height = tabHeight - 29;
         }else if(Ext.isIE6){
            obj.height = tabHeight - 26;
         }else{
            obj.height = tabHeight - 28;
         }
      }
