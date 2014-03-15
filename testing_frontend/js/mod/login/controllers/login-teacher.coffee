define (require) ->
	$ = require 'jquery'
	Spine = require 'spine'
	rfl = require 'rfl'
	langResourceCommon = require 'lang/{{G.LANG}}/common'
	formUtil = require 'form-util'

	class LoginTeacher extends Spine.Controller

		events:
			'click [data-login-btn]' : 'login'

		teacherTpl: require '../views/login-teacher.tpl.html'

		init:->
			@render()

		render: ->
			@html @teacherTpl.render()

		login: ->
			data = formUtil.getData '#teacher-login-form'
			if not data.username 
				alert('请输入用户名')
				return
			if not data.password
				alert('请输入密码')
				return
			rfl.ajax.post
				url: "loginAsTeacher"
				data: {username: data.username, password: data.password}
				success: (res)->
					if res.code is 0
						rfl.util.gotoUrl "teacher/dashboard"
					else
						rfl.alerts.show res.message, 'error'

	LoginTeacher