define (require) ->
	$ = require 'jquery'
	Spine = require 'spine'
	rfl = require 'rfl'
	langResourceCommon = require 'lang/{{G.LANG}}/common'
	langResourceAdRemark = require 'lang/{{G.LANG}}/ad-remark'
	StudentLogin = require './login-student'
	TeacherLogin = require './login-teacher'

	class Login extends Spine.Controller
		events: 
			'click .teacher-btn': 'loginAsTeacher'
			'click .student-btn': 'loginAsStudent'

		mainTpl: require '../views/login-main.tpl.html'
		studentLoginTpl: require '../views/login-student.tpl.html'
		teacherLoginTpl: require '../views/login-teacher.tpl.html'

		init:->
			@render()

		render: ->
			@html @mainTpl.render()

		loginAsStudent: ->
			new StudentLogin({el: "#main-div"})

		loginAsTeacher: ->
			console.log 'loginAsTeacher'
			new TeacherLogin({el: "#main-div"})

	Login