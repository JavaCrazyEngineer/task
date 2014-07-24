Ext.require(['*']);
Ext.onReady(function() {
    var cw;
    
    Ext.create('Ext.Viewport', {
        layout: {
            type: 'border',
            padding: 5
        },
        defaults: {
            split: true
        },
        items: [{
            region: 'north',
            collapsible: true,
            title: 'North',
            split: true,
            height: 80,
//            minHeight: 60,
            html: '<iframe src="'+ctx+'/top" frameborder="0" width="100%" height="100%" scrolling="no"></iframe>'
        },{
            region: 'west',
            title: '系统导航',
            iconCls:'menu_top',
		    animate:true,
            collapsible: true,
            split: true,
            width: 188,
            minSize: 188,
	        maxSize: 155,
            margins: '2 0 2 2',
            border:true,
            root:[],
            html: '<iframe src="'+ctx+'/menu" frameborder="0" width="100%" height="100%" scrolling="no"></iframe>'
        },{
        	id:'tabs',
            region: 'center',
            layout: 'border',
            border: false,
            deferredRender: false,
	        enableTabScroll:true,
	        activeTab: 0,    
	        margins: '2 2 2 2',
	        defaults: {
                autoHeight:true,
	            autoScroll:true
	         },
	         plugins: new Ext.ux.TabCloseMenu(),
	         items: [cw = Ext.create('Ext.Window', {
		         id:'tab_0000',
		         iconCls: 'icon_0010',
		         title: 'welcome',
		         html: '<iframe src="'+ctx+'/hello.jsp" name="tabIframe_0000" frameborder="0" width="100%" height="100%" onload="javascript:setTabIframeHeight(this)" scrolling="auto"></iframe>',
		         listeners:{
		            "bodyresize" : function(){
		               window.frames["tabIframe_0000"].location.href = "hello.jsp"; 
		            }
		         }
	         })]
        },{
        	region: 'south', 
	   		height : 39,
	   		contentEl :'bottom'
        }]
    });
});