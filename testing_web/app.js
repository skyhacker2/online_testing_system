var express = require('express');
var app = express();

app.use(express.bodyParser());
app.use(express.static('src/main/webapp'));

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

// 教师登陆
app.post('/loginAsTeacher.json', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	console.log(username);
	console.log(password);
	if (username == 'admin' && password == 'admin') {
		res.end(JSON.stringify({
			code: 0,
			message: "ok",
			data: null
		}));
	} else {
		res.end(JSON.stringify({
			code: 1,
			message: "账号或密码错误",
			data: null
		}));
	}
});

// 学生登陆
app.post('/loginAsStudent.json', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	if (username == 'admin' && password == 'admin') {
		res.end(JSON.stringify({
			code: 0,
			message: "ok",
			data: null
		}));
	} else {
		res.end(JSON.stringify({
			code: 1,
			message: "账号或密码错误",
			data: null
		}));
	}
});