package com.jscn.platform.task.web;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jscn.commons.core.lang.Result;
import com.jscn.commons.core.utils.EncryptUtil;
import com.jscn.commons.core.utils.MD5;
import com.jscn.platform.task.util.Constant;


@Controller
public class LoginController {
	
	@Value("${task.user.name}")
	private String USERNAME;
	@Value("${task.user.password}")
	private String PASSWORD;
	
	
	@RequestMapping("/login")
	@ResponseBody
	public Result login(@RequestParam String userName, @RequestParam String password,HttpSession session){
		if(userName.equals(USERNAME) && password.equals(EncryptUtil.md5Hex(PASSWORD))){
			session.setAttribute(Constant.USER_IS_LOGIN, true);
			return new Result(true,"登录成功!");
		}else{
			return new Result(false,"登录失败!");
		}
	}
	
}
