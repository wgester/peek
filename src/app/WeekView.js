define(function(require, exports, module) {
    var Surface          = require('famous/core/Surface');
    var Modifier         = require('famous/core/Modifier');
    var Transform        = require('famous/core/Transform');
    var View             = require('famous/core/View');


    function NewWeek(date, differentMonth) {
        View.apply(this, arguments);

        this.date = date;
        this.differentMonth = differentMonth;
        _createBackground.call(this);
        _addBorder.call(this);
        _addDays.call(this);

        this.clicked = false;
    };

    NewWeek.prototype = Object.create(View.prototype);
    NewWeek.prototype.constructor = NewWeek;

    NewWeek.DEFAULT_OPTIONS = {};

    var weekDay = {
        0: 'MON',
        1: 'TUE',
        2: 'WED',
        3: 'THU',
        4: 'FRI',
        5: 'SAT',
        6: 'SUN'
    };

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
            if (this.date === 6 && i === 6) {
                daySurface.on('click', function() {
                    this._eventOutput.emit('clicked');
                    if (this.clicked) {
                        this.highlightModifier.setOpacity(0.001);
                        this.dateSurface.setProperties({
                             color: 'white'
                        });
                    } else {
                        this.highlightModifier.setOpacity(1);
                        this.dateSurface.setProperties({
                             color: '#3b6d7d'
                        });
                    }
                    this.clicked = !this.clicked;
                }.bind(this));
                daySurface.pipe(this);
            }
            _addDateText.call(this, {dayView: day, i: i});
            _addWeekDayText.call(this, {dayView: day, weekDay: weekDay[i], i: i});
            this._add(dayModifier).add(daySurface);
            this._add(day);
        }
    };

    _addDateText = function(data) {
        if (this.date < 10) {
            var date = '0' + this.date;
        } else {
            var date = this.date;
        }
        var date = new Surface({
            content: date,
            properties: {
                fontSize: '1.2em',
                fontFamily: 'arial'
            },
            size: [0,0]
        });
        if (this.date === 6) {
            this.dateSurface = date;
            this.highlight = new Surface({
                size: [30,25],
                properties: {
                    backgroundColor: 'white'
                }
            });
            this.highlightModifier = new Modifier({
                transform: Transform.translate(0.18 * (window.innerWidth / 7) + data.i * window.innerWidth / 7, 0.105 * window.innerHeight, 0),
                opacity: 0.001
            });
            data.dayView._add(this.highlightModifier).add(this.highlight);
        }
        var dateModifier = new Modifier({
            transform: Transform.translate(0.25 * (window.innerWidth / 7) + data.i * window.innerWidth / 7, 0.11 * window.innerHeight, 1),
            opacity: 0.8
        });
        if (this.differentMonth && this.date === 31) {dateModifier.setOpacity(0.4)}; 
        if (this.differentMonth && this.date < 10) {dateModifier.setOpacity(0.4)}; 
        data.dayView._add(dateModifier).add(date);
        if (this.date > 29) {
            if (this.date === 31) this.differentMonth = false;
            this.date = 0;
        }
        this.date += 1;
    };

    _addWeekDayText = function(data) {
        var weekDay = new Surface({
            content: data.weekDay,
            properties: {
                fontSize: '0.5em',
                opacity: 0.6,
                fontFamily: 'arial'
            },
            size: [0,0]
        });
        var weekDayModifier = new Modifier({
            transform: Transform.translate(0.28 * (window.innerWidth / 7) + data.i * window.innerWidth / 7, 0.08 * window.innerHeight, 0)
        });
        data.dayView._add(weekDayModifier).add(weekDay);
    };


    NewWeek.prototype.getSize = function getSize() {
        return [window.innerWidth, 0.1911 * window.innerHeight];
    }


    module.exports = NewWeek;
});
