define(function(require, exports, module) {
    var OptionsManager   = require('famous/core/OptionsManager');
    var SequentialLayout = require('famous/views/SequentialLayout');
    var ViewSequence     = require('famous/core/ViewSequence');
    var View             = require('famous/core/View');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
  
    function AccordionLayout() {
        SequentialLayout.apply(this, arguments);

        this._items = [];
        this._modifiers = [];
    };



    AccordionLayout.prototype = Object.create(SequentialLayout.prototype);

    AccordionLayout.prototype.sequenceFrom = function(items) {
        if (items instanceof Array) {
            var axis = 0;
            for (var i = 0; i < items.length; i++) {
                var containerView = new View();
                var sizeModifier = new Modifier({
                    size: [undefined, items[i].getSize()[1]]
                });
                var originModifier = new Modifier({
                    origin: [0, axis]
                });
                containerView._add(sizeModifier).add(originModifier).add(items[i]);
                this._modifiers.push(originModifier);
                this._items.push(containerView);
                if (!axis) axis = 1;
                if (axis)  axis = 0;
            }
            this._items = new ViewSequence(this._items)
        }
        return this;
    };

    AccordionLayout.prototype.open = function() {
        this._modifiers[0].setTransform(Transform.rotateX(-Math.PI * 0.5), {duration: 1000})
    };


    module.exports = AccordionLayout;
});