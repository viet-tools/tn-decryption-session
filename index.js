/**
 * Created by viet-tools
 * User: viettools
 */

'use strict';

const axios = require("axios");
const colors = require('colors');
const sessions = require("client-sessions");

const session_client: {
	cookieName: 'tndata', // cookie name dictates the key name added to the request object
	secret: '$&38t_$+f52fdgdASF*^', // should be a large unguessable string
	duration: 60 * 60 * 1000, // how long the session will stay valid in ms
	activeDuration: 1000 * 60 * 60, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
	cookie: {
		domain: '.trangnguyen.edu.vn',
		path: '/', // cookie will only be sent to requests under '/api'
		// maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
		ephemeral: true, // when true, cookie expires when the browser closes
		// httpOnly: true, // when true, cookie is not accessible from javascript
		// secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
	}
};

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
	return sessions.util.decode(session_client, session_string);
};

const init = async () => {
	const res = await getCaptcha();
	const cookie = getCookie(res);
	const sessionData = decodeSession(cookie.split('=')[1]);

	console.log(colors.cyan('Cookie:'), colors.green(cookie));
	if (sessionData) {
		console.log(colors.cyan('Session:'), colors.green(JSON.stringify(sessionData)));
	} else {
		console.log(colors.cyan('Secret:'), colors.yellow(session_client.secret), colors.red('incorrect'));
	}
};

init();
