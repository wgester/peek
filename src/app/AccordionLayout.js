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
    };


    AccordionLayout.prototype.sequenceFrom = function sequenceFrom(items) {
        if (items instanceof Array) {
            var axis = 0;
            for (var i = 0; i < items.length; i++) {
                var containerView = new View();
                var originModifier = new Modifier({
                    origin: [0, axis]
                });
                var sizeModifier = new Modifier({
                    size: [undefined, items[i].getSize()[1]]
                });
                containerView._add(originModifier).add(sizeModifier);
                this._items.push(items[i]);
                if (!axis) axis = 1;
                if (axis)  axis = 0;
                console.log(this._items)
            }
            this._items = new ViewSequence(this._items)
        }
        return this;
    };

    AccordionLayout.prototype = Object.create(SequentialLayout.prototype);

    module.exports = AccordionLayout;
});