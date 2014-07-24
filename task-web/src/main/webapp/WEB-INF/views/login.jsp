<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>江苏广电亨通商城-定时任务系统登录</title>
<link rel="stylesheet" type="text/css" href="${ctx}/resources/css/layout.css" />
<link rel="stylesheet" type="text/css" href="${ctx}/resources/css/style_main.css" />
<script type="text/javascript" src="${ctx}/resources/js/ext3.4/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/ext3.4/ext-all.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/ext3.4/ux/ExtMD5.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/handleException.js"></script>
<script type="text/javascript">
   //登录
   function login(){
	   var userName = Ext.getDom('userName').value;
	   var password = Ext.getDom('password').value;
	   if(userName == "" || password == ""){
		   Ext.getDom('errormsg').innerHTML = '用户名和密码不能为空';
		   Ext.getDom('loginerror').style.display = '';
		   return;
	   }
	   var cookiePassword = Ext.state.Manager.get('cookiePassword');
	   password = password==cookiePassword?password:Ext.MD5(password);
	   if(Ext.getDom('rememberPwd').checked){
		   Ext.state.Manager.set('rememberPwd', "true");
		   Ext.state.Manager.set('cookieUserName', userName);
		   Ext.state.Manager.set('cookiePassword', password);
	   }else{
		   Ext.state.Manager.set('rememberPwd', "false");
	   }
	   Ext.getDom("loginbtn").disabled = true;
	   try{
		   Ext.Ajax.request({
	           url: "${ctx}/login",    
	           method: "post",
	           params: {    
	        	   userName : userName,
	        	   password : password
	           },
	           //请求成功的回调函数
	           success: function(response, opts) { 
	        	   var json = Ext.decode(response.responseText);
	        	   if(json.success){
	        		   Ext.getDom("loginbtn").disabled = false;
	        		   location.href = '${ctx}/main';
	        	   }else{
	        		   Ext.getDom("loginbtn").disabled = false;
	        		   if(json.errorCode=='exception'){
	        			   handleException('${ctx}/exception',json.message);
	        			   return;
	        		   }else if(json.errorCode=='accountError'){
	        			   Ext.getDom('userName').value = '';
		        		   Ext.getDom('password').value = '';
	        		   }
	        		   Ext.getDom('errormsg').innerHTML = json.message;
	 	  		   	   Ext.getDom('loginerror').style.display = '';
	        	   }
	           }, 
	           // 请求失败的回调函数
	           failure: function(response, opts) {
	        	   Ext.getDom("loginbtn").disabled = false;
	        	   handleException('${ctx}/exception');
    			   return;
	           }  
	       });
	   }catch(e){
		   Ext.getDom("loginbtn").disabled = false;
		   location.href = location.href;
		   Ext.getDom('errormsg').innerHTML = "系统出错";
		   Ext.getDom('loginerror').style.display = '';
	   }

   }
   
   //登录初始化
   function loginInit(){
	   Ext.getDom('loginerror').style.display = 'none';
	   Ext.getDom('browseMsg').style.display = 'none';
	   Ext.getDom('errormsg').vaule = '';
	   var rememberPwd = Ext.state.Manager.get('rememberPwd');
	   if(rememberPwd == "true"){
		   var cookieUserName = Ext.state.Manager.get('cookieUserName');
		   var cookiePassword = Ext.state.Manager.get('cookiePassword');
		   Ext.getDom('userName').value = cookieUserName;
		   Ext.getDom('password').value = cookiePassword;
		   Ext.getDom('rememberPwd').checked = true;
	   }else{
		   Ext.getDom('userName').value = '';
		   Ext.getDom('password').value = '';
		   Ext.getDom('rememberPwd').checked = false;
	   }
	   if(!Ext.isIE){
		   Ext.getDom('browseMsg').style.display = '';
	   }
   }
   
   Ext.onReady(function(){
	   Ext.state.Manager.setProvider(new Ext.state.CookieProvider({})); 
	   loginInit();
   });
</script>
</head>

  <body style="background-color: #d6dee0;">
	<div class="loginbg">
		<div class="loginmainbg">
			<div class="loginul">
				<ul>
					<li style="width: 60px; font-size: 14px;">用户名:</li>
					<li><input id="userName" name="userName" type="text" class="input1" maxlength='30'/></li>
					<li style="width: 60px; font-size: 14px;">密 码:</li>
					<li><input id="password" name="password" type="password" class="input1" maxlength='12'/></li>
					<li style="width: 60px; font-size: 14px;"></li>
					<li><input id="rememberPwd" type="checkbox" />记住密码</li>
					<li style="width: 60px; font-size: 14px;"></li>
					<li>
					   <input id='loginbtn' type="image" src="${ctx}/resources/images/button.jpg" width="123" height="40" onclick='javascript:login()'/>
					   <div id='loginerror' style='line-height:40px;display:none;'><span>提示：</span>
					        <span id='errormsg' style="font-size: 14px;color:red;"></span>
					   </div>
					</li>
				</ul>
			</div>
		</div>
		<div id='browseMsg' style='text-align: center;color:red;display:none;'>为了保证界面的布局整齐，请使用IE6.0以上浏览器</div>
		<div class="loginbottom">Copyright © 2012 江苏省广电网络科技发展有限公司. All rights reserved.</div>
	</div>
</body>
</html>