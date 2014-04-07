define(function(require, exports, module) {
    var Surface          = require('famous/core/Surface');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var View             = require('famous/core/View');
    var ImageSurface     = require('famous/surfaces/ImageSurface');
    var SequentialLayout = require('famous/views/SequentialLayout');

    var Week         = require('./WeekView')

    var RenderNode = require('famous/core/RenderNode');

    function App() {
        View.apply(this, arguments);

        this.weekViews = [];
        this.taskModifiers = [];
        this.tasks = [];

        this.date = 31;

        _createHeader.call(this);
        _createWeekView.call(this);
        _addTaskViews.call(this);
        _addTaskViews.call(this);
        _createAccordion.call(this);
        this.taskModifiers[0].setSize([undefined, 100], {duration: 0})
        this.taskModifiers[1].setTransform(Transform.rotateX(-2), {duration: 3000})
        // this.taskModifiers[0].setTransform(Transform.aboutOrigin([0,100,0], Transform.rotateX(Math.PI * 0.5)), {duration: 3000})
        this.taskModifiers[0].setTransform(Transform.rotateX(Math.PI * 0.5), {duration: 1000});
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

    _createAccordion = function() {
        console.log(this.taskModifiers)
        this.accordion = new SequentialLayout();
        this.accordion.sequenceFrom(this.tasks);

        this.weekViews.splice(1, 0, this.accordion);
    };

    _addTaskViews = function() {
        var newView = new View();
        
        var taskView = new View();
        var task = new Surface({
            size : [window.innerWidth, 100],
            content: 'here',
            properties: {
                backgroundColor: 'white',
                color: 'brown',
                fontSize: '4em'
            }
        });
        var sizeModifier = new Modifier({
            size: [undefined, 100]
        })
        var taskModifier = new Modifier({
            origin: [0, 1]
        });
        taskView.add(taskModifier).add(task);
        newView._add(sizeModifier).add(taskView)

        this.taskModifiers.push(taskModifier);

        this.tasks.push(newView);

    };


    module.exports = App;
});

//lighter bacc45
//darker  b0ba45
//0.1911