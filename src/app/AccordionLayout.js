define(function(require, exports, module) {
    var Utility          = require('famous/utilities/Utility');
    var OptionsManager   = require('famous/core/OptionsManager');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var ViewSequence     = require('famous/core/ViewSequence');
    var View             = require('famous/core/View');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var Transitionable   = require('famous/transitions/Transitionable');

  
    function AccordionLayout(options) {
        if (options.direction === 'y') options.direction = 0; 
        if (options.direction === 'x') options.direction = 1;

        SequentialLayout.apply(this, options);
        this.setOptions(AccordionLayout.DEFAULT_OPTIONS);

        if (options) this.setOptions(options);

        this._items = [];
        this._views = [];
        this._sizes = [];
        this._modifiers = [];
        this._overModifiers = [];
        this._viewSizeModifiers = [];

        this.angle = this.options.direction ? new Transitionable(Math.PI/2) : new Transitionable(-Math.PI/2);
    };

    AccordionLayout.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        transition:{
            duration: 500,
            curve: 'linear'
        }
    };

    function hingeView(renderable, axis) {
        var size = renderable.getSize()[this.options.direction];
        this._sizes.push(size);
        var hingeView = new View();
        var origin = this.options.direction ? [0.5, axis] : [axis, 0.5];
        var size = this.options.direction ? [undefined, size] : [size, undefined];

        var originModifier = new Modifier({
            origin: origin
        });
        var sizeModifier = new Modifier({
            size: size
        });
        var viewSizeModifier = new Modifier({
            size: size
        });

        this._modifiers.push(originModifier);
        this._overModifiers.push(sizeModifier);
        this._viewSizeModifiers.push(viewSizeModifier);
        hingeView._add(viewSizeModifier).add(sizeModifier).add(originModifier).add(renderable);
        return hingeView;
    };

    function _attachModifiers() {
        for (var i = 0; i < this._modifiers.length; i++) {
            if (i % 2) {
                this._modifiers[i].transformFrom(function() {
                    return this.options.direction ? Transform.rotateX(this.angle.get()) : Transform.rotateY(this.angle.get());
                }.bind(this));
                this._overModifiers[i].transformFrom(function(i) {
                    var translation = this._sizes[i] * Math.cos(this.angle.get()) - this._sizes[i];
                    return this.options.direction ? Transform.translate(0, translation, 0) : Transform.translate(translation, 0, 0);
                }.bind(this, i));
            } else {
                this._modifiers[i].transformFrom(function() {
                    return this.options.direction ? Transform.rotateX(-this.angle.get()) : Transform.rotateY(-this.angle.get());
                }.bind(this));
            }
            this._viewSizeModifiers[i].sizeFrom(function(i) {
                var newSize = this._sizes[i] * Math.cos(this.angle.get());
                return this.options.direction ? [undefined, newSize] : [newSize, undefined];
            }.bind(this, i));
        }
    };

    function _getAngle() {
        return this.angle.get();
    };

    AccordionLayout.prototype = Object.create(SequentialLayout.prototype);

    AccordionLayout.prototype.sequenceFrom = function(items) {
        if (items instanceof Array) {
            var axis = 0;
            for (var i = 0; i < items.length; i++) {
                var hingedItem = hingeView.apply(this, [items[i], axis]);
                this._items.push(hingedItem);
                this._views.push(hingedItem);
                axis = axis ? 0 : 1;
            }
            this._items = new ViewSequence(this._items)
        }
        _attachModifiers.call(this);
        return this;
    };

    AccordionLayout.prototype.open = function() {
            this.angle.set(0, this.options.transition);
    };

    AccordionLayout.prototype.close = function() {
        var angle = this.options.direction ? Math.PI/2 : -Math.PI/2;
            this.angle.set(angle, this.options.transition);
    };

    module.exports = AccordionLayout;
});