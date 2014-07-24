<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<script type="text/javascript" src="${ctx}/resources/js/ext3.4/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/ext3.4/ext-all-debug.js"></script>
<script type="text/javascript"
	src="${ctx}/resources/js/ext3.4/ux/fileuploadfield/FileUploadField.js"></script>
<script type="text/javascript"
	src="${ctx}/resources/js/ext3.4/locale/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/ext3.4/ux/TabCloseMenu.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/ext3.4/ux/ext-basex.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/ext3.4/ux/gridExport.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/colrenderer.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/handleException.js"></script>
<script type="text/javascript">
	Ext.form.Field.prototype.msgTarget = 'side';
	Ext.QuickTips.init();
	var ctx = "${ctx}";
	var rowsPerPage = 20;
	var pageSizeStore = [[20,'20条/页'],[50,'50条/页'],[100,'100条/页'],[200,'200条/页']];
	var querytriggerGroupArray = [['','所有分组'],['TVMALL','TVMALL'],['JSCNPAY','JSCNPAY'],['JSCNBI','JSCNBI']];
	var triggerGroupArray = [['TVMALL','TVMALL'],['JSCNPAY','JSCNPAY'],['JSCNBI','JSCNBI']];
	
	//Ext.util.CSS.swapStyleSheet('theme', 'js/ext3.4/resources/css/xtheme-gray.css');
	//Ext.BLANK_IMAGE_URL = 'js/ext3.4/images/gray/s.gif';
</script>