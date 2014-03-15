define (require) ->
	$ = require 'jquery'
	Spine = require 'spine'
	rfl = require 'rfl'
	langResourceCommon = require 'lang/{{G.LANG}}/common'

	class ViewGrade extends Spine.Controller

		gradeListTpl: require '../views/grade-list.tpl.html'

		init: ->
			@render()

		render: ->
			@html @gradeListTpl.render()

	ViewGrade