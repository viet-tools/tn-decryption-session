/**
 * Created by viet-tools
 * User: viettools
 */

'use strict';

const axios = require("axios");
const colors = require('colors');
const sessions = require("client-sessions");
const config = require("./config");

const getCaptcha = async () => {
	return await axios.get("https://trangnguyen.edu.vn/captcha.png");
};

const getCookie = (res) => {
	const cookies = res.headers['set-cookie'];
	const filter = cookies.filter(cookie => {
		return cookie.indexOf('tndata=') === 0;
	});

	if(filter.length > 0) {
		return filter[0].split(';')[0];
	}
	return '';
};

const decodeSession = (session_string) => {
	return sessions.util.decode(config.session_client, session_string);
};

const init = async () => {
	const res = await getCaptcha();
	const cookie = getCookie(res);
	const sessionData = decodeSession(cookie.split('=')[1]);

	console.log(colors.cyan('Cookie:'), colors.green(cookie));
	if (sessionData) {
		console.log(colors.cyan('Session:'), colors.green(JSON.stringify(sessionData)));
	} else {
		console.log(colors.cyan('Secret:'), colors.yellow(config.session_client.secret), colors.red('incorrect'));
	}
};

init();