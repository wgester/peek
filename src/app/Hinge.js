define(function(require, exports, module) {
    var Utility          = require('famous/utilities/Utility');
    var OptionsManager   = require('famous/core/OptionsManager');
    var RenderNode       = require('famous/core/RenderNode');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var Transitionable   = require('famous/transitions/Transitionable');

    function Hinge(renderable, options) {
        if (!options) options = {};

        if (options.direction === 'y') options.direction = 0; 
        if (options.direction === 'x') options.direction = 1;

        if (options.axis === 'left' || options.axis === 'top') options.axis = 0;
        if (options.axis === 'right' || options.axis === 'bottom') options.axis = 1;

        this.options = Object.create(Hinge.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);
        
        this.size = renderable.getSize()[this.options.direction];

        var origin = this.options.direction ? [0.5, this.options.axis] : [this.options.axis, 0.5];
        var size = this.options.direction ? [undefined, this.size] : [this.size, undefined];

        this.originModifier = new Modifier({
            origin: origin
        });
        this.sizeModifier = new Modifier({
            size: size
        });
        this.viewSizeModifier = new Modifier({
            size: size
        });

        this.angle = new Transitionable(this.options.angle);
        _attachModifiers.call(this);

        this.add(this.viewSizeModifier).add(this.sizeModifier).add(this.originModifier).add(renderable);
    };

    Hinge.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        axis: 0,
        angle: 0,
        anchor: 0,
        transition:{
            duration: 500,
            curve: 'linear'
        }
    };

    function _attachModifiers() {
        this.originModifier.transformFrom(function() {
            if (this.options.axis) {
                return this.options.direction ? Transform.rotateX(this.angle.get()) : Transform.rotateY(this.angle.get());
            } else {
                return this.options.direction ? Transform.rotateX(-this.angle.get()) : Transform.rotateY(-this.angle.get());
            }
        }.bind(this));
        if (this.options.anchor) {
            this.sizeModifier.transformFrom(function() {
                    var translation = this.size * Math.cos(this.angle.get()) - this.size;
                    return this.options.direction ? Transform.translate(0, translation, 0) : Transform.translate(translation, 0, 0);
            }.bind(this));
        }
        this.viewSizeModifier.sizeFrom(function() {
            var newSize = this.size * Math.cos(this.angle.get());
            return this.options.direction ? [undefined, newSize] : [newSize, undefined];
        }.bind(this));
    };

    Hinge.prototype = Object.create(RenderNode.prototype);

    Hinge.prototype.setOptions = function setOptions(options) {
        this.optionsManager.setOptions.apply(this.optionsManager, arguments);
        return this;
    };

    Hinge.prototype.setAngle = function(angle, transition) {
        transition ? this.angle.set(angle, transition) : this.angle.set(angle, this.options.transition);
    };


    module.exports = Hinge;
});