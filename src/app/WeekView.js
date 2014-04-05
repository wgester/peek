define(function(require, exports, module) {
    var Surface          = require('famous/core/Surface');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var View             = require('famous/core/View');


    function App() {
        View.apply(this, arguments);
        _createBackground.call(this);
        _addBorder.call(this);
        _addDays.call(this);
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

    _addDays = function() {
        for (var i = 0; i < 7; i++) {
            var day = new View({
                size: [window.innerWidth/7, 0.1911 * window.innerHeight]
            });

            var daySurface = new Surface({
                size: [window.innerWidth/7, 0.1911 * window.innerHeight]
            });
            var dayModifier = new Modifier({
                transform: Transform.translate(i * window.innerWidth/7, 0, 0)
            });
            
            _addDayText.call(day, i);
            this._add(dayModifier).add(daySurface);
            this._add(day);
        }
    };

    _addDayText = function(i) {
            var date = new Surface({
                content: '0' + i + '',
                properties: {
                    fontSize: '1.5em'
                },
                size: [0,0]
            });
            var dateModifier = new Modifier({
                transform: Transform.translate(0.25 * (window.innerWidth / 7) + i * window.innerWidth / 7, 0.12 * window.innerHeight, 0)
            })
            this._add(dateModifier).add(date);
    };

    App.prototype.getSize = function getSize() {
        return [window.innerWidth, 0.1911 * window.innerHeight];
    }


    module.exports = App;
});
