/**   
*树形下拉框   
*/

Ext.form.TreeField = Ext.extend(Ext.form.TriggerField,  {   
    /**  
     * @cfg {Boolean} readOnly  
     * 设置为只读状态  
     *   
     */  
    readOnly : true ,   
    /**  
     * @cfg {String} displayField  
     * 用于显示数据的字段名  
     *   
     */  
    displayField : 'text',   
    /**  
     * @cfg {String} valueField  
     * 用于保存真实数据的字段名  
     */  
    valueField : null,   
    /**  
     * @cfg {String} hiddenName  
     * 保存真实数据的隐藏域名  
     */  
    hiddenName : null,   
    /**  
     * @cfg {Integer} listWidth  
     * 下拉框的宽度  
     */  
    listWidth : null,   
    /**  
     * @cfg {Integer} minListWidth  
     * 下拉框最小宽度  
     */  
    minListWidth : 100,   
    /**  
     * @cfg {Integer} listHeight  
     * 下拉框高度  
     */  
    listHeight : null,   
    /**  
     * @cfg {Integer} minListHeight  
     * 下拉框最小高度  
     */  
    minListHeight : 150,   
    /**  
     * @cfg {Integer} maxListHeight  
     * 下拉框最大高度  
     */  
    maxListHeight : 200,   
    /**  
     * @cfg {String} dataUrl  
     * 数据地址  
     */  
    dataUrl : null,
    /**  
     * @cfg {Ext.tree.TreePanel} tree  
     * 下拉框中的树  
     */  
    tree : null,   
    /**  
     * @cfg {String} value  
     * 默认值  
     */  
    value : null,   
    /**  
     * @cfg {String} displayValue  
     * 用于显示的默认值  
     */  
    displayValue : null,   
    /**  
     * @cfg {Object} baseParams  
     * 向后台传递的参数集合  
     */  
    baseParams : {},   
    /**  
     * @cfg {Object} treeRootConfig  
     * 树根节点的配置参数  
     */  
    treeRootConfig : {   
        id : ' ',   
        text : 'root',   
        draggable:false  
    }, 
    /**
     * @cfg {String/Object}
     * 级联操作的dom对象参数
     */
    cascadeDomParams:{
       id:'',
       valueField:'',
       displayField:''
    },
    /**
     * @cfg {String/Object}
     * 是否只有叶子节点可以选
     */
    isLeafSelect:true,
    /**  
     * @cfg {String/Object} autoCreate  
     * A DomHelper element spec, or true for a default element spec (defaults to  
     * {tag: "input", type: "text", size: "24", autocomplete: "off"})  
     */  
    defaultAutoCreate : {tag: "input", type: "text", size: "24", autocomplete: "off"},   
  
    initComponent : function(){   
        Ext.form.TreeField.superclass.initComponent.call(this);   
        this.addEvents(   
                'select',   
                'expand',   
                'collapse',   
                'beforeselect'        
        );   
           
    },   
    initList : function(){ 
        if(!this.list){   
            var cls = 'x-treefield-list';   
  
            this.list = new Ext.Layer({   
                shadow: this.shadow, cls: [cls, this.listClass].join(' '), constrain:false  
            });   
  
            var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);   
            this.list.setWidth(lw);   
            this.list.swallowEvent('mousewheel');   
               
            this.innerList = this.list.createChild({cls:cls+'-inner'});   
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));   
            this.innerList.setHeight((this.listHeight< this.maxListHeight?this.listHeight:this.maxListHeight)|| this.minListHeight);   
            if(!this.tree){   
                this.tree = this.createTree(this.innerList);       
            }   
            this.tree.on('click',this.select,this);   
            this.tree.render();   
        }   
    },   
    onRender : function(ct, position){   
        Ext.form.TreeField.superclass.onRender.call(this, ct, position);   
        if(this.hiddenName){   
            this.hiddenField = this.el.insertSibling({tag:'input',    
                                                     type:'hidden',    
                                                     name: this.hiddenName,    
                                                     id: (this.hiddenId||this.hiddenName)},   
                    'before', true);   
            this.hiddenField.value =   
                this.hiddenValue !== undefined ? this.hiddenValue :   
                this.value !== undefined ? this.value : '';   
            this.el.dom.removeAttribute('name');   
        }   
        if(Ext.isGecko){   
            this.el.dom.setAttribute('autocomplete', 'off');   
        }   
        this.initList();   
    },   
    select : function(node){   
        if(this.fireEvent('beforeselect', node, this)!= false){   
            this.onSelect(node);   
            this.fireEvent('select', this, node);   
        }   
    },   
    onSelect:function(node){ 
        if(!this.isLeafSelect || this.isLeafSelect && node.isLeaf()){
            this.setValue(node);   
            this.collapse();   
        }else{
            node.expand(true);
        }
    },   
    createTree:function(el){  
        var hiddenPkgs = [];
        var Tree = Ext.tree;   
        var tree = new Tree.TreePanel({   
            el:el,   
            height:(el.getHeight()+50),   
            autoScroll:true,   
            animate:true,   
            containerScroll: true, 
            rootVisible: false,
            root: new Tree.AsyncTreeNode(this.treeRootConfig),
            loader: new Tree.TreeLoader({   
                dataUrl : this.dataUrl,   
                baseParams : this.baseParams   
            }),
            bbar:['-',
                {
                    xtype:'trigger',
					width: 100,
					emptyText:'过滤节点...',
		            triggerClass:'x-form-search-trigger',
		            onTriggerClick:function(){
		              var params = this.baseParams;
		              if(this.getValue()!=''){
		                if(params){
		                   var paramsJsonStr = Ext.util.JSON.encode(params); 
		                   paramsJsonStr = paramsJsonStr.substring(0,1)+"'filterVal':'"+this.getValue()+"',"+paramsJsonStr.substring(1);
		                   params = Ext.util.JSON.decode(paramsJsonStr); 
		                }else{
		                   params = {filterVal:this.getValue()};
		                }
		             }else{
		                params = {};
		             }
		             tree.loader.baseParams = params;
		             tree.root.reload();
		           }
			    },'->','-',{
	               text:'展开',
	               handler: function(){
	                tree.expandAll();
	               }
	            },'-',{
	               text:'折叠',
	               handler: function(){
	                tree.collapseAll();
	               }
	            },'-']   
        });   
        return tree;   
    },   
  
    getValue : function(){   
        if(this.valueField){   
            return typeof this.value != 'undefined' ? this.value : '';   
        }else{   
            return Ext.form.TreeField.superclass.getValue.call(this);   
        }   
    },   
    setValue : function(node){ 
        //if(!node)return;   
        var text,value; 
        if(node && typeof node == 'object'){   
            text = node[this.displayField] || node.attributes[this.displayField] || node['text'];  
            value = node[this.valueField || this.displayField] || node['id'];   
            Ext.form.TreeField.superclass.setValue.call(this, text);  
            //级联操作对象
	        if(this.cascadeDomParams){
	           var casDom = Ext.getCmp(this.cascadeDomParams.id);
	           if(casDom){
	              if(this.cascadeDomParams.valueField && !Ext.isEmpty(this.cascadeDomParams.valueField)){
	                 casDom.setValue(node.attributes[this.cascadeDomParams.valueField]);
	                 if(casDom.hiddenField){   
			            casDom.hiddenField.value = node.attributes[this.cascadeDomParams.valueField];   
			         } 
	              }
	              if(this.cascadeDomParams.displayField && !Ext.isEmpty(this.cascadeDomParams.displayField)){
	                 casDom.setRawValue(node.attributes[this.cascadeDomParams.displayField]);
	              }
	           }
	        }  
        }else{   
            text = node;   
            value = node;  
            //表单修改回填时，需要将value和text同时返回并以“@”分隔 
            if(node && node.indexOf("@")>-1){
               text = node.split("@")[0];   
               value = node.split("@")[0];   
	           this.setRawValue(node.split("@")[1]);
	        }
        }   
        if(this.hiddenField){   
            this.hiddenField.value = value;   
        }   
        this.value = value; 
    },   
    onResize: function(w, h){   
        Ext.form.TreeField.superclass.onResize.apply(this, arguments);   
        if(this.list && this.listWidth == null){   
            var lw = Math.max(w, this.minListWidth);   
            this.list.setWidth(lw);   
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));   
        }   
    },   
    validateBlur : function(){   
        return !this.list || !this.list.isVisible();      
    },   
    onDestroy : function(){   
        if(this.list){   
            this.list.destroy();   
        }   
        if(this.wrap){   
            this.wrap.remove();   
        }   
        Ext.form.TreeField.superclass.onDestroy.call(this);   
    },   
    collapseIf : function(e){   
        if(!e.within(this.wrap) && !e.within(this.list)){   
            this.collapse();   
        }   
    },   
  
    collapse : function(){   
        if(!this.isExpanded()){   
            return;   
        }   
        this.list.hide();   
        Ext.getDoc().un('mousewheel', this.collapseIf, this);   
        Ext.getDoc().un('mousedown', this.collapseIf, this);   
        this.fireEvent('collapse', this);   
    },   
    expand : function(){   
        if(this.isExpanded() || !this.hasFocus){   
            return;   
        }   
        this.onExpand();   
        this.list.alignTo(this.wrap, this.listAlign);   
        this.list.show();   
        Ext.getDoc().on('mousewheel', this.collapseIf, this);   
        Ext.getDoc().on('mousedown', this.collapseIf, this);   
        this.fireEvent('expand', this);   
    },   
    onExpand : function(){   
        var doc = Ext.getDoc();   
        //this.on('click',function(){alert(111)},this);   
    },   
    isExpanded : function(){   
        return this.list && this.list.isVisible();   
    },   
    onTriggerClick : function(){   
        if(this.disabled){   
            return;   
        }   
        if(this.isExpanded()){   
            this.collapse();   
        }else {   
            this.onFocus({});   
            this.expand();   
        }   
        this.el.focus();   
    }   
});   
Ext.reg('treeField', Ext.form.TreeField);