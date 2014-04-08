define(function(require, exports, module) {
    var OptionsManager   = require('famous/core/OptionsManager');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var ViewSequence     = require('famous/core/ViewSequence');
    var View             = require('famous/core/View');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var Engine           = require('famous/core/Engine');
    var Transitionable   = require('famous/transitions/Transitionable');
  
    function AccordionLayout() {
        SequentialLayout.apply(this, arguments);

        this._items = [];
        this._modifiers = [];
        this._axes = [];
        this._views = [];
        this._heights = [];
        this._overModifiers = [];
    };

    function hingeView(renderable, axis) {
        height = renderable.getSize()[1];
        this._heights.push(height);
        var containerView = new View();
        var sizeModifier = new Modifier({
            size: [undefined, height]
        });
        var originModifier = new Modifier({
            origin: [0.5, axis]
        });
        // if (!axis) {
        //     containerView.getSize = function() {
        //         return [undefined, height * Math.sin(originModifier.getTransform()[5]/2*Math.PI)];
        //     };
        //     // Engine.on('prerender', function() {
        //     //     sizeModifier.setTransform(Transform.translate(0, height - containerView.getSize()[1], 0))
        //     // }.bind(this));
        // } else {
        //     containerView.getSize = function() {
        //        return [undefined, height * Math.sin(originModifier.getTransform()[5]/2*Math.PI)];
        //     };
        //     Engine.on('prerender', function() {
        //         sizeModifier.setTransform(Transform.translate(0, -height + containerView.getSize()[1], 0))
        //     }.bind(this));
        // }
        this._modifiers.push(originModifier);
        this._overModifiers.push(sizeModifier);
        containerView._add(sizeModifier).add(originModifier).add(renderable);
        return containerView;
    };


    AccordionLayout.prototype = Object.create(SequentialLayout.prototype);

    AccordionLayout.prototype.sequenceFrom = function(items) {
        if (items instanceof Array) {
            var axis = 0;
            for (var i = 0; i < items.length; i++) {
                var hingedItem = hingeView.apply(this, [items[i], axis]);
                this._items.push(hingedItem);
                this._views.push(hingedItem);
                this._axes.push(axis);
                if (!axis) axis = 1;
                else       axis = 0;
            }
            this._items = new ViewSequence(this._items)
        }
        return this;
    };

    AccordionLayout.prototype.open = function() {
        this.angle = new Transitionable(0);
        this.angle.set(Math.PI/2, {duration: 3000});
        Engine.on('prerender', function() {
            for (var i = 0; i < this._modifiers.length; i++) {
                if (this._axes[i]) {
                    this._modifiers[i].setTransform(Transform.rotateX(this.angle.get()));
                    this._views[i].getSize = function() {
                        return [undefined, 100 * Math.cos(this.angle.get())];
                    }.bind(this);
                    this._overModifiers[i].setTransform(Transform.translate(0, -100 + 100 * Math.cos(this.angle.get()), 0))
                } else {
                    this._modifiers[i].setTransform(Transform.rotateX(-this.angle.get()));
                    this._views[i].getSize = function() {
                        return [undefined, 100 * Math.cos(this.angle.get())];
                    }.bind(this);
                }
            }
        }.bind(this));
    };


    module.exports = AccordionLayout;
});