define(function(require, exports, module) {
    var Surface          = require('famous/core/Surface');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var View             = require('famous/core/View');


    function App() {
        View.apply(this, arguments);
        _createBackground.call(this);
        _addBorder.call(this);
    };

    App.prototype = Object.create(View.prototype);
    App.prototype.constructor = App;

    App.DEFAULT_OPTIONS = {};

    _createBackground = function() {
        this.background = new Surface({
            size : [undefined, 0.1911 * window.innerHeight],
            properties: {
                background: '#bacc45'
            }
        });
        this._add(this.background);
    };

    _addBorder = function() {
        var line = new Surface({
            size: [undefined, 2],
            properties: {
                background: '#bdcf48'
            }
        });
        this._add(line);
    };

    App.prototype.getSize = function getSize() {
        return [window.innerWidth, 0.1911 * window.innerHeight];
    }


    module.exports = App;
});
