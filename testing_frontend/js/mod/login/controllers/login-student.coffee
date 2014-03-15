define (require) ->
	$ = require 'jquery'
	Spine = require 'spine'
	rfl = require 'rfl'
	langResourceCommon = require 'lang/{{G.LANG}}/common'

	class LoginStudent extends Spine.Controller
		events:
			'click [data-login-btn]' : 'login'

		mainTpl: require '../views/login-student.tpl.html'

		init:->
			@render()

		render: ->
			@html @mainTpl.render()

		login: ->
			
			rfl.util.gotoUrl 'student/dashboard'

	LoginStudent