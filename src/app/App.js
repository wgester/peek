define(function(require, exports, module) {
    var Surface          = require('famous/core/Surface');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var View             = require('famous/core/View');
    var ImageSurface     = require('famous/surfaces/ImageSurface');
    var SequentialLayout = require('famous/views/SequentialLayout');

    function App() {
        View.apply(this, arguments);
        _createHeader.call(this);
    }

    App.prototype = Object.create(View.prototype);
    App.prototype.constructor = App;

    App.DEFAULT_OPTIONS = {};


    _createHeader = function() {
        this.header = new ImageSurface({
            size: [undefined, 0.105 * window.innerHeight],
            content: 'img/header1.png'
        });
        this.add(this.header);
    }


    module.exports = App;
});

//lighter bacc45
//darker  b0ba45
//0.1911