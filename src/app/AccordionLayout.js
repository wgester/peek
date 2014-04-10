define(function(require, exports, module) {
    var Utility          = require('famous/utilities/Utility');
    var OptionsManager   = require('famous/core/OptionsManager');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var ViewSequence     = require('famous/core/ViewSequence');
    var View             = require('famous/core/View');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var Engine           = require('famous/core/Engine');
    var Transitionable   = require('famous/transitions/Transitionable');
    require('famous/inputs/FastClick');
  
    function AccordionLayout() {
        SequentialLayout.apply(this, arguments);

        this._items = [];
        this._modifiers = [];
        this._axes = [];
        this._views = [];
        this._heights = [];
        this._overModifiers = [];
        this.duration = 0;
        this.angle = new Transitionable(Math.PI/2);
        this.close()
        this.duration = 500;
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
        this._modifiers.push(originModifier);
        this._overModifiers.push(sizeModifier);
        containerView._add(sizeModifier).add(originModifier).add(renderable);
        return containerView;
    };

    function _attachModifiers() {
        for (var i = 0; i < this._modifiers.length; i++) {
            if (this._axes[i]) {
                this._modifiers[i].transformFrom(function() {
                    return Transform.rotateX(this.angle.get());
                }.bind(this));
                this._overModifiers[i].transformFrom(function() {
                    return Transform.translate(0, -0.1911 * window.innerHeight + 0.1911 * window.innerHeight * Math.cos(this.angle.get()), 0);
                }.bind(this));
            } else {
                this._modifiers[i].transformFrom(function() {
                    return Transform.rotateX(-this.angle.get());
                }.bind(this));
            }
        }
    }


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
        _attachModifiers.call(this);
        return this;
    };

    AccordionLayout.prototype.open = function() {
        this.angle.set(Math.PI/2);
        this.angle.set(0, {duration: this.duration});
    };

    AccordionLayout.prototype.close = function() {
        this.angle.set(0);
        this.angle.set(Math.PI/2, {duration: this.duration});
    };

    AccordionLayout.prototype.render = function render() {
        var length = 0;
        var girth = 0;

        var lengthDim = (this.options.direction === Utility.Direction.X) ? 0 : 1;
        var girthDim = (this.options.direction === Utility.Direction.X) ? 1 : 0;

        var currentNode = this._items;
        var result = [];
        while (currentNode) {
            var item = currentNode.get();

            var itemSize;
            if (item && item.getSize) itemSize = item.getSize();
            if (!itemSize) itemSize = this.options.defaultItemSize;
            if (itemSize[girthDim] !== true) girth = Math.max(girth, itemSize[girthDim]);

            var output = this._outputFunction.call(this, item, length, result.length);
            result.push(output);

            if (itemSize[lengthDim] && (itemSize[lengthDim] !== true)) length += itemSize[lengthDim];
            currentNode = currentNode.getNext();
        }

        if (!girth) girth = undefined;

        if (!this._size) this._size = [0, 0];
        this._size[lengthDim] = length;
        this._size[girthDim] = girth;


        for (var i = 0; i < this._modifiers.length; i++) {
            this._views[i].getSize = function() {
                return [undefined, 0.1911 * window.innerHeight * Math.cos(this.angle.get())];
            }.bind(this);
        }

        return {
            size: this.getSize(),
            target: result
        };
    };


    module.exports = AccordionLayout;
});