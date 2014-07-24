/**
 * 报表菜单
 **/
function BiMenu(){
   this._menuIds = [];
   this._titles = [];
   this._children = [];
}
BiMenu.prototype = {
   /**
    *{id:'一级菜单ID',title:'一级菜单名称',items:[{id:'二级菜单ID',title:'二级菜单名称',url:'二级菜单请求页面url'}]}
    */
   add : function(params){
       params = params || {};
	   this._menuIds.push(params.id);
	   this._titles.push(params.title);
	   this._children.push(params.items||[]);
   },
   /**
    * renderId :菜单渲染ID
    */
   renderTo : function(renderId){
      var menuHtml = '<div class="side" style="overflow: hidden;">';
      	  menuHtml += '<div class="menu_bg">';
      	  for(var i=0;i<this._menuIds.length;i++){
      	     menuHtml += '<div class="munu_title" id="'+this._menuIds[i]+'" onClick=Effect(\"test'+i+'\",\"'+renderId+'\",\"'+this._menuIds.length+'\")>';
      	     //一级菜单
      	     menuHtml += '<ul>';
      	     menuHtml += '<li id="test'+i+'tab" style="float: right;">';
      	     menuHtml += '<a href="#"><img src="resources/images/jia.jpg"/></a>';
      	     menuHtml += '</li>';
      	     menuHtml += '<li style="float: left">';
      	     menuHtml += '<a href="#" class="testLink">'+this._titles[i]+'</a>';
      	     menuHtml += '</li>';
      	     menuHtml += '</ul>';
      	     menuHtml += '</div>';
      	     //二级菜单
      	     menuHtml += '<div id="test'+i+'" class="test" style="display: none;">';
      	     menuHtml += '<ul>';
      	     
      	     var child = this._children[i];
      	     for(var j=0;j<child.length;j++){
      	         menuHtml += '<li class="normal1" onclick=parent.addTab(\"'+child[j].title+'\",\"'+child[j].url+'\",\"'+child[j].id+'\")>';
      	         menuHtml += child[j].title;
      	         menuHtml += '</li>';
      	     }
      	     menuHtml += '</ul>';
      	     menuHtml += '</div>';
      	  } 
      	  menuHtml += '</div>';
      	  menuHtml += '</div>';
      document.getElementById(renderId).innerHTML = menuHtml;
      document.getElementById(this._menuIds[0]).click();
   }
}