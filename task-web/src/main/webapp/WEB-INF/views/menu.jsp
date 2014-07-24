<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link rel="stylesheet" type="text/css" href="${ctx}/resources/css/layout.css" />
		<link rel="stylesheet" type="text/css" href="${ctx}/resources/css/style_main.css" />
		<script type="text/javascript" src="${ctx}/resources/js/BiMenu.js"></script>
<%@ include file="/WEB-INF/views/commons/taglibs.jsp"%>
	</head>
	<style type="text/css">
		html {
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			padding: 0px 5px 0px 0px;
			box-sizing: border-box;
			overflow: hidden;
		}
		
		html,body {
			height: 100%;
		}
	</style>
	<script>
		function $G(Read_Id) { 
			return document.getElementById(Read_Id) 
		}
		//改编caiying2007
		var openedObjId=null;
		var openIdx = 0;
		/**
		 * ObjectId 展开的子菜单列表ID
		 * containId 菜单容器ID
		 * count 一级菜单数
		 */
		function Effect(ObjectId,containId,count){
			if (openedObjId){
				$G(openedObjId+"tab").innerHTML = "<a href=# ><img src='${ctx}/resources/images/jia.jpg '></a>"; 
				Start(openedObjId,'Close',containId,count);
			}
			if(openedObjId!=ObjectId){
			    //openIdx = parseInt(ObjectId.substring(4))+1;
				$G(ObjectId+"tab").innerHTML = "<a href=# ><img src='${ctx}/resources/images/jian.jpg '></a>";
				Start(ObjectId,'Opens',containId,count);
				openedObjId=ObjectId
			}
			else openedObjId=null
		}
		function Start(ObjId,method,containId,count){
			var BoxHeight = $G(ObjId).offsetHeight;   			//获取对象高度
			var expandHeight = document.getElementById(containId).offsetHeight - count*32-10; //展开高度
			var MinHeight = 5;									//定义对象最小高度
			var MaxHeight = expandHeight>0?expandHeight:230;					 			//定义对象最大高度
			var BoxAddMax = 1;									//递增量初始值
			var Every_Add = 0.15;								//每次的递(减)增量  [数值越大速度越快]
			var Reduce    = (BoxAddMax - Every_Add);
			var Add       = (BoxAddMax + Every_Add);
			//关闭动作**************************************
			if (method == "Close"){
				var Alter_Close = function(){						//构建一个虚拟的[递减]循环
					BoxAddMax /= Reduce;
					BoxHeight -= BoxAddMax;
					if (BoxHeight <= MinHeight){
						$G(ObjId).style.display = "none";
						window.clearInterval(BoxAction);
					}
					else $G(ObjId).style.height = BoxHeight;
				}
				var BoxAction = window.setInterval(Alter_Close,1);
			}
			//打开动作**************************************
			else if (method == "Opens"){
			var Alter_Opens = function(){
				BoxAddMax *= Add;
				BoxHeight += BoxAddMax;
				if (BoxHeight >= MaxHeight){
					$G(ObjId).style.height = MaxHeight;
					window.clearInterval(BoxAction);
				}else{
				$G(ObjId).style.display= "block";
				$G(ObjId).style.height = BoxHeight;
				}
			}
			var BoxAction = window.setInterval(Alter_Opens,1);
			}
		}
		window.onload = function(){
		   var menu = new BiMenu();
			menu.add({
			   id:'0010',
			   title:'定时系统管理',
			   items:[{
			   	  id:'0011',
			      title:'定时任务管理',
			      url:'${ctx}/job/manager/'
			     },{
			      id:'0012',
			      title:'定时任务执行历史',
			      url:'${ctx}/job/log/'
			     }]
			});
			
			menu.renderTo('menu');
		}
	</script>

	<body>
	<div id='menu' style='height:100%'></div>
	</body>
</html>