<%@ page language="java" import="java.util.*,java.io.*"
	pageEncoding="UTF-8"%>
<%@ include file="taglibs.jsp"%>
<%@page isErrorPage="true"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<style>
body {
	font: 12px/22px Verdana, Arial, Helvetica, sans-serif;
	color: #555;
	margin: 0;
}
</style>
<script type="text/javascript">
	function retry() {
		window.history.back(-1);
	}
	function copyToClipboard() {
		var d = document.getElementById("err");
		var rng = document.body.createTextRange();
		rng.moveToElementText(d);
		rng.scrollIntoView();
		rng.select();
		rng.execCommand("Copy");
		rng.collapse(false);
		//alert("复制成功!"); 
	}
</script>
<body>
	<table width="95%" align="center">
		<tr>
			<td align="left" width="40%"><img src="${ctx}/resources/images/error_msg.gif"
				id="error_img" /></td>
			<td align="left" width="60%">尊敬的用户： <br /> 系统出现了异常，请&nbsp;<a
				href="javascript:retry()">重试</a>。 <br /> 如果问题重复出现，请向系统管理员反馈。 <br />
				<br /> <a href="javascript:copyToClipboard();">复制</a>&nbsp;
			</td>
		</tr>
		<tr>
			<td colspan='2' style="border-bottom: dotted 1px Gray;"></td>
		</tr>
		<tr>
			<td colspan='2'>
				<div id='err'>
					<c:out value="${param.exceptionContent}" escapeXml="false"/>
				</div>
			</td>
		</tr>
	</table>
</body>
</html>