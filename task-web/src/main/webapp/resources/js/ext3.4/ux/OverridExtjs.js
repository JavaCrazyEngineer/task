/**
 * radiogroup checkboxgroup 动态赋值
 */
Ext.override(Ext.form.BasicForm,{
    findField : function(id){        
        var field = this.items.get(id);        
        if(!field){
            this.items.each(function(f){
                if(f.isXType('radiogroup')||f.isXType('checkboxgroup')||f.isXType('compositefield')){
                    f.items.each(function(c){
                        if(c.isFormField && (c.dataIndex == id || c.id == id || c.getName() == id)){
                            field = c;
                            return false;
                        }
                    });
                }
                                
                if(f.isFormField && (f.dataIndex == id || f.id == id || f.getName() == id)){
                    field = f;
                    return false;
                }
            });
        }
        return field || null;
    } 
});

/**
 *Ext readyOnly 按Backspace后退页面解决方法
 */
if(document.addEventListener){
    document.addEventListener("keydown",maskBackspace, true);
}else{
    document.attachEvent("onkeydown",maskBackspace);
}

function maskBackspace(event){
    var event = event || window.event; //标准化事件对象
    var obj = event.target || event.srcElement;
    var keyCode = event.keyCode ? event.keyCode : event.which ?
            event.which : event.charCode;
    if(keyCode == 8){
        if(obj!=null && obj.tagName!=null && (obj.tagName.toLowerCase() == "input" 
               || obj.tagName.toLowerCase() == "textarea")){
            event.returnValue = true ;
            if(Ext.getCmp(obj.id)){
                if(Ext.getCmp(obj.id).readOnly || Ext.getCmp(obj.id).editable == false) {
                    if(window.event)
                        event.returnValue = false ; //or event.keyCode=0
                    else
                        event.preventDefault();   //for ff[/b]
                }
            }
        }else{
            if(window.event)
                event.returnValue = false ;   // or event.keyCode=0
            else
                event.preventDefault(); 
        }
    }
}
 


