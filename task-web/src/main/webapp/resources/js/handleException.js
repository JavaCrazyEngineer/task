function handleException(url,exceptionContent){
	var formId = "hiddenform_"+(new Date().getTime()); 
	var fd = Ext.get(formId);
    if (!fd) {
        fd = Ext.DomHelper.append(Ext.getBody(),
            {tag:'form',method:'post',id:formId,action:url, target:'_top',name:'hiddenform',cls:'x-hidden',cn:[
            {tag:'input',name:'exceptionContent',type:'hidden',value:exceptionContent}
        ]},true);
    }
    fd.dom.submit();
}