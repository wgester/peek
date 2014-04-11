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
  
    function AccordionLayout(options) {
        SequentialLayout.apply(this, arguments);

        this._items = [];
        this._views = [];
        this._sizes = [];
        this._modifiers = [];
        this._overModifiers = [];


        if (options.direction === 'y') options.direction = 0; 
        if (options.direction === 'x') options.direction = 1;
        
        if (options.direction) {
            this.angle = new Transitionable(Math.PI/2);
        } else {
            this.angle = new Transitionable(-Math.PI/2);
        }

        this.options = Object.create(this.constructor.DEFAULT_OPTIONS);
        this.optionsManager = new OptionsManager(this.options);

        if (options) this.setOptions(options);
    };

    AccordionLayout.DEFAULT_OPTIONS = {
        direction: Utility.Direction.Y,
        duration: 500
    };

    function hingeView(renderable, axis) {
        var size = renderable.getSize()[this.options.direction];
        this._sizes.push(size);
        var containerView = new View();
        if (this.options.direction) {
            var originModifier = new Modifier({
                origin: [0.5, axis]
            });
            var sizeModifier = new Modifier({
                size: [undefined, size]
            });
        } else {
            var originModifier = new Modifier({
                origin: [axis, 0.5]
            });
            var sizeModifier = new Modifier({
                size: [size, undefined]
            });
        }
        this._modifiers.push(originModifier);
        this._overModifiers.push(sizeModifier);
        containerView._add(sizeModifier).add(originModifier).add(renderable);
        return containerView;
    };

    function _attachModifiers() {
        for (var i = 0; i < this._modifiers.length; i++) {
            if (i % 2) {
                this._modifiers[i].transformFrom(function() {
                    if (this.options.direction) {
                        return Transform.rotateX(this.angle.get());
                    } else {
                        return Transform.rotateY(this.angle.get());
                    }
                }.bind(this));
                this._overModifiers[i].transformFrom(function(i) {
                    if (this.options.direction) {
                        return Transform.translate(0, this._sizes[i] * Math.cos(this.angle.get()) - this._sizes[i], 0);
                    } else {
                        return Transform.translate(this._sizes[i] * Math.cos(this.angle.get()) - this._sizes[i], 0, 0);
                    }
                }.bind(this, i));
            } else {
                this._modifiers[i].transformFrom(function() {
                    if (this.options.direction) {
                        return Transform.rotateX(-this.angle.get());
                    } else {
                        return Transform.rotateY(-this.angle.get());
                    }
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
                if (!axis) axis = 1;
                else       axis = 0;
            }
            this._items = new ViewSequence(this._items)
        }
        _attachModifiers.call(this);
        return this;
    };

    AccordionLayout.prototype.open = function() {
        if (this.options.direction) {
            this.angle.set(Math.PI/2);
            this.angle.set(0, {duration: this.options.duration});
        } else {
            this.angle.set(-Math.PI/2);
            this.angle.set(0, {duration: this.options.duration});
        }
    };

    AccordionLayout.prototype.close = function() {
        if (this.options.direction) {
            this.angle.set(0);
            this.angle.set(Math.PI/2, {duration: this.options.duration});
        } else {
            this.angle.set(0);
            this.angle.set(-Math.PI/2, {duration: this.options.duration});
        }
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
            this._views[i].getSize = function(i) {
                if (this.options.direction) {
                    return [undefined, this._sizes[i] * Math.cos(this.angle.get())];
                } else {
                    return [this._sizes[i] * Math.cos(this.angle.get()), undefined];
                }
            }.bind(this, i);
        }

        return {
            size: this.getSize(),
            target: result
        };
    };


    module.exports = AccordionLayout;
});