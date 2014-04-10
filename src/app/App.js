define(function(require, exports, module) {
    var Surface           = require('famous/core/Surface');
    var Modifier          = require('famous/core/Modifier');
    var Transform         = require('famous/core/Transform');
    var View              = require('famous/core/View');
    var ImageSurface      = require('famous/surfaces/ImageSurface');
    var ContainerSurface  = require('famous/surfaces/ContainerSurface');
    var SequentialLayout  = require('famous/views/SequentialLayout');
    var Engine            = require('famous/core/Engine');

    var Week              = require('./WeekView')
    var AccordionLayout   = require('./AccordionLayout');

    var RenderNode        = require('famous/core/RenderNode');
    
    require('famous/inputs/FastClick')

    function App() {
        View.apply(this, arguments);

        this.weekViews = [];
        this.taskModifiers = [];
        this.tasks = [];

        this.date = 31;
        this.opened = false;
        this.throttled = false;

        _createHeader.call(this);
        _createWeekView.call(this);
        _addTaskViews.apply(this, ['Roller Disco Party!', '08:00', 'PM']);
        _addTaskViews.apply(this, ['Fun Times!', '08:00', 'AM']);

  
        _createAccordion.call(this);
        _bindEvents.call(this);
    };

    App.prototype = Object.create(View.prototype);
    App.prototype.constructor = App;

    App.DEFAULT_OPTIONS = {};

    _bindEvents = function() {
        Engine.on('click', function() {
            if (!this.throttled) {
                if (this.opened) this.accordion.close();
                else this.accordion.open();
                this.opened = !this.opened;
                this.throttled = true;
                window.setTimeout(function(){this.throttled = false}.bind(this), 500);
            }
        }.bind(this))  
    };


    _createHeader = function() {
        var sizeModifier = new Modifier({
            size: [undefined, 0.105 * window.innerHeight]
        });

        var header = new View();

        var headerSurface = new Surface({
            content: headerTemplate(),
            classes: ['header']
        });

        function headerTemplate() {
            return '<img class="feather" style="height:' + 0.095 * window.innerHeight + 'px";width:' + 0.095 * window.innerHeight +'px" src="img/feather.png"></img>' +
            '<div class="month" style="margin-left:' + 0.3125 * window.innerWidth  + 'px">April</div>' +
            '<div class="year">2014</div>';
        };

        header._add(headerSurface);
        this._add(sizeModifier).add(header);
    };

    _createWeekView = function() {
        this.layout = new SequentialLayout();
        var layoutModifier = new Modifier({
            transform: Transform.translate(0, 0.105 * window.innerHeight, 0)
        });
        for (var i = 0; i < 5; i++) {
            if (this.date > 27) {
                var differentMonth = true;
            }
            var weekView = new View();
            var week = new Week(this.date, differentMonth);
            var weekModifier = new Modifier();
            weekView._add(weekModifier).add(week);
            this.weekViews.push(weekView);
            if (this.date > 30) {
                this.date = 0;
            }
            this.date += 7;
            differentMonth = false;
        }
        this.layout.sequenceFrom(this.weekViews);
        this._add(layoutModifier).add(this.layout);
    };

    _createAccordion = function() {
        this.accordion = new AccordionLayout();
        this.accordion.sequenceFrom(this.tasks);

        this.weekViews.splice(1, 0, this.accordion);
    };

    _addTaskViews = function(text, time, ampm) {
        var taskView = new View();
        var task = new ContainerSurface({
            size : [undefined, 0.1911 * window.innerHeight],
            content: text,
            properties: {
                backgroundColor: 'white',
                fontSize: '3em',
            }
        });

        var text = new Surface({
            size: [undefined,0],
            content: text,
            properties: {
                color: '#698991',
                fontSize: '0.37em',
                left: '34%',
                top: '38%',
                fontFamily: 'helvetica'
            }
        });

        var timeContainer = new ContainerSurface({
            size: [50, 26],
            properties: {
                backgroundColor: '#fcb530',
                left: '6%',
                top: '35%'
            }
        });

        var time = new Surface({
            content: time,
            properties: {
                color: 'white',
                fontSize: '0.35em',
                left: '10%',
                top: '10%',
                fontFamily: 'helvetica'
            }
        });



        timeContainer.add(time);

        var ampm = new Surface({
            size: [undefined, 0],
            content: ampm,
            opacity: 0.5,
            properties: {
                color: '#698991',
                fontSize: '0.04em',
                left: '24%',
                top: '42%',
                fontFamily: 'helvetica'
            }
        });

        var line = new Surface({
            size: [undefined, 1],
            properties: {
                opacity: 0.1,
                backgroundColor: 'black'
            }
        });
        task.add(text);
        task.add(timeContainer);
        task.add(ampm);
        task.add(line);
        taskView._add(task);


        this.tasks.push(taskView);

    };


    module.exports = App;
});
