define (require) ->
	$ = require 'jquery'
	Spine = require 'spine'
	rfl = require 'rfl'
	langResourceCommon = require 'lang/{{G.LANG}}/common'

	class ViewGrade extends Spine.Controller

		viewGradeTpl: require '../views/view-grade.tpl.html'

		init: ->
			@render()

		render: ->
			@html @viewGradeTpl.render()

	ViewGrade