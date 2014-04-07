define(function(require, exports, module) {
    var Surface          = require('famous/core/Surface');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var View             = require('famous/core/View');
    var ImageSurface     = require('famous/surfaces/ImageSurface');
    var SequentialLayout = require('famous/views/SequentialLayout');

    var Week         = require('./WeekView')

    function App() {
        View.apply(this, arguments);

        this.weekViews = [];

        this.date = 31;

        _createHeader.call(this);
        _createWeekView.call(this);
    };

    App.prototype = Object.create(View.prototype);
    App.prototype.constructor = App;

    App.DEFAULT_OPTIONS = {};


    _createHeader = function() {
        this.header = new ImageSurface({
            size: [undefined, 0.105 * window.innerHeight],
            content: 'img/header1.png'
        });
        this.add(this.header);
    };

    _createWeekView = function() {
        this.layout = new SequentialLayout();
        var layoutModifier = new Modifier({
            transform: Transform.translate(0, 0.105 * window.innerHeight, 0)
        });
        for (var i = 0; i < 5; i++) {
            var weekView = new View();
            var week = new Week(this.date);
            var weekModifier = new Modifier();
            weekView._add(weekModifier).add(week);
            this.weekViews.push(weekView);
            if (this.date > 30) {
                this.date = 0;
            }
            this.date += 7;
        }
        this.layout.sequenceFrom(this.weekViews);
        this._add(layoutModifier).add(this.layout);
    };


    module.exports = App;
});

//lighter bacc45
//darker  b0ba45
//0.1911