// Generated by CoffeeScript 1.6.3
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(function(require) {
    var $, Dashboard, Spine, langResourceCommon, rfl, _ref;
    $ = require('jquery');
    Spine = require('spine');
    rfl = require('rfl');
    langResourceCommon = require('lang/{{G.LANG}}/common');
    Dashboard = (function(_super) {
      __extends(Dashboard, _super);

      function Dashboard() {
        _ref = Dashboard.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Dashboard.prototype.dashboardTpl = require('../views/dashboard.tpl.html');

      Dashboard.prototype.init = function() {
        return this.render();
      };

      Dashboard.prototype.render = function() {
        return this.html(this.dashboardTpl.render());
      };

      return Dashboard;

    })(Spine.Controller);
    return Dashboard;
  });

}).call(this);
