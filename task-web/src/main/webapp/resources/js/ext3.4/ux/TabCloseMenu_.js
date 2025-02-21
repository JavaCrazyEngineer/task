Ext.ux.TabCloseMenu = function(){
    var tabs, menu, ctxItem;
    this.init = function(tp){
        tabs = tp;
        tabs.on('contextmenu', onContextMenu);
        tabs.initEvents = function(){   
	       Ext.TabPanel.superclass.initEvents.call(this);   
	       this.mon(this.strip, 'mousedown', this.onStripMouseDown, this);
	       this.mon(this.strip, 'contextmenu', this.onStripContextMenu, this);   
           if(this.enableTabScroll){   
              this.mon(this.strip, 'mousewheel', this.onWheel, this);   
           }   
           this.mon(this.strip,'dblclick',this.onTitleDbClick,this);   
	    };
	    tabs.onTitleDbClick = function(e,target,o){   
           var t = this.findTargets(e);   
           if(t.item && t.item.closable){
	           if (t.item.fireEvent('beforeclose', t.item) !== false) {   
	              t.item.fireEvent('close', t.item);   
	              this.remove(t.item);                   
	           } 
           }
        }
    }
    
    function onContextMenu(ts, item, e){
        if(!menu){ // create context menu on first right click
            menu = new Ext.menu.Menu([{
                id: tabs.id + '-close',
                text: '关闭标签',
                iconCls:'closeTab_title', 
                handler : function(){
                    tabs.remove(ctxItem);
                }
            },{
                id: tabs.id + '-close-others',
                text: '关闭其他标签',
                iconCls:'closeOtherTab_title', 
                handler : function(){
                    tabs.items.each(function(item){
                        if(item.closable && item != ctxItem){
                            tabs.remove(item);
                        }
                    });
                }
            },{
                id: tabs.id + '-close-all',
                text: '关闭全部标签',
                iconCls:'closeAllTab_title', 
                handler : function(){
                    tabs.items.each(function(item){
                        if(item.closable){
                            tabs.remove(item);
                        }
                    });
                }
            },{
                id: tabs.id + '-cancel',
                text: '取消',
                iconCls:'cancleTab_title', 
                handler : function(){
                	menu.hide();
                }
            }]);
        }
        ctxItem = item;
        var items = menu.items;
        items.get(tabs.id + '-close').setDisabled(!item.closable);
        var disableOthers = true;
        tabs.items.each(function(){ 
            if(this != item && this.closable){
                disableOthers = false;
                return false;
            }
        });
        items.get(tabs.id + '-close-others').setDisabled(disableOthers);
        var disableAll = true;
        tabs.items.each(function(){
            if(this.closable){
                disableAll = false;
                return false;
            }
        });
        items.get(tabs.id + '-close-all').setDisabled(disableAll);
        menu.showAt(e.getPoint());
    }
};
