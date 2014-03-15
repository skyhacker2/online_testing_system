define (require) ->
	$ = require 'jquery'
	Spine = require 'spine'
	rfl = require 'rfl'
	langResourceCommon = require 'lang/{{G.LANG}}/common'

	class Dashboard extends Spine.Controller

		dashboardTpl: require '../views/dashboard.tpl.html'

		init: ->
			@render()

		render: ->
			@html @dashboardTpl.render()

	Dashboard