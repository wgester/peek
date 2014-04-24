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
        _addTaskViews.call(this, 'RollerDiscoParty');
        _addTaskViews.call(this, 'FunTimes');


       
  
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
        this.accordion = new AccordionLayout({
            direction: 'x', 
            transition: {
                curve: 'easeOut',
                duration: 1000
            }
        });
        this.accordion.sequenceFrom(this.tasks);

        this.weekViews.splice(1, 0, this.accordion);
    };

    _addTaskViews = function(img) {
        var taskView = new View();
        
        var subView = new View();

        var taskImage = new ImageSurface({
            content: 'img/' + img +'.png'
        });

        var taskImageModifier = new Modifier({
            size: [undefined, 0.19 * window.innerHeight]
        });
        var taskImage2 = new ImageSurface({
            content: 'img/' + img + 'Shaded.png'
        });

        this.taskImageModifier2 = new Modifier({
            opacity: 0
        });
        this.taskImageModifier2.opacityFrom(function() {
            return Math.sin(this.accordion.angle.get())
        }.bind(this));


        subView._add(taskImage);
        subView._add(this.taskImageModifier2).add(taskImage2);
        taskView._add(taskImageModifier).add(subView);
        this.tasks.push(taskView);


    };


    module.exports = App;
});
