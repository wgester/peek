define(function(require, exports, module) {
    var Utility          = require('famous/utilities/Utility');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var ViewSequence     = require('famous/core/ViewSequence');
    var Transitionable   = require('famous/transitions/Transitionable');
    var Hinge      = require('./Hinge');

  
    function AccordionLayout(options) {
        if (options.direction === 'y') options.direction = 0; 
        if (options.direction === 'x') options.direction = 1;

        SequentialLayout.apply(this, options);
        this.setOptions(AccordionLayout.DEFAULT_OPTIONS);

        if (options) this.setOptions(options);

        this._items = [];
        this._views = [];

        this.angle = this.options.direction ? new Transitionable(Math.PI/2) : new Transitionable(-Math.PI/2);
    };

    AccordionLayout.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        transition:{
            duration: 500,
            curve: 'linear'
        }
    };


    AccordionLayout.prototype = Object.create(SequentialLayout.prototype);

    AccordionLayout.prototype.sequenceFrom = function(items) {
        if (items instanceof Array) {
            for (var i = 0; i < items.length; i++) {
                if (i % 2) {
                    var hingedItem = new Hinge(items[i], {angle: Math.PI/2, axis: 1, anchor: 1, transition: this.options.transition});
                } else {
                    var hingedItem = new Hinge(items[i], {angle: Math.PI/2, transition: this.options.transition});
                    
                }
                this._items.push(hingedItem);
                this._views.push(hingedItem);
            }
            this._items = new ViewSequence(this._items)
        }
        return this;
    };

    AccordionLayout.prototype.open = function() {
        for (var i = 0; i < this._views.length; i++) {
            this._views[i].setAngle(0);
        }
        this.angle.set(0, this.options.transition);
    };

    AccordionLayout.prototype.close = function() {
        for (var i = 0; i < this._views.length; i++) {
            this._views[i].setAngle(Math.PI/2);
        }
        this.angle.set(Math.PI/2, this.options.transition);
    };

    module.exports = AccordionLayout;
});