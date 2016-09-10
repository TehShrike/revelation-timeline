(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = [{ "title": "Crucifixion", "hebrew": { "start": "Ab 14, 4030", "end": "Ab 14, 4030" }, "macedonian": "Xanthicus 14, 341", "gregorian": { "start": "April 4, 30", "end": "April 4, 30" }, "day": { "start": "-14731", "end": "-14731" }, "amd": { "start": 1471937, "end": 1471937 } }, { "title": "Resurrection", "hebrew": { "start": "Ab 16, 4030", "end": "Ab 16, 4030" }, "macedonian": "Xanthicus 16, 341", "gregorian": { "start": "April 6, 30", "end": "April 6, 30" }, "day": { "start": "-14729", "end": "-14729" }, "amd": { "start": 1471939, "end": 1471939 } }, { "title": "Ascension", "hebrew": { "start": "Iyar 24, 4030", "end": "Iyar 24, 4030" }, "macedonian": "Xanthicus 24, 341", "gregorian": { "start": "May 14, 30", "end": "May 14, 30" }, "day": { "start": "-14689", "end": "-14689" }, "amd": { "start": 1471977, "end": 1471977 }, "sermon": "Revelation 4-5" }, { "title": "Seventh Seal", "hebrew": { "start": "Sivan 7, 4066", "end": "Sivan 7, 4066" }, "macedonian": "Daisios 7, 377", "gregorian": { "start": "May 18, 66", "end": "May 18, 66" }, "josephus war 6": "299", "day": { "start": "-1538", "end": "-1538" }, "amd": { "start": 1485130, "end": 1485130 }, "sermon": "Revelation 4-5" }, { "title": "First Trumpet", "hebrew": { "start": "Tishri 1, 4066", "end": "Tishri 1, 4066" }, "macedonian": "Hyperberataios 1, 377", "gregorian": { "start": "September 8, 66", "end": "September 8, 66" }, "day": { "start": "-1426", "end": "-1426" }, "amd": { "start": 1485242, "end": 1485242 }, "sermon": "Revelation 8:7" }, { "title": "Second Trumpet", "hebrew": { "start": "Tishri 15, 4066", "end": "Tishri 15, 4066" }, "macedonian": "Hyperberataios 15, 377", "gregorian": { "start": "Sept 22, 66", "end": "Sept 22, 66" }, "josephus war 2": "515", "day": { "start": "-1412", "end": "-1412" }, "amd": { "start": 1485256, "end": 1485256 }, "sermon": "Revelation 8:8-9" }, { "title": "Third Trumpet", "hebrew": { "start": "Tishri 22, 4066", "end": "Tishri 22, 4066" }, "macedonian": "Hyperberataios 22, 377", "gregorian": { "start": "September 28, 66", "end": "September 28, 66" }, "day": { "start": "-1405", "end": "-1405" }, "amd": { "start": 1485263, "end": 1485263 }, "sermon": "Revelation 8:10-11" }, { "title": "Fourth Trumpet - Cestius defeated", "hebrew": { "start": "Heshvan 9, 4066", "end": "Heshvan 9, 4066" }, "macedonian": "Dios 9, 377", "gregorian": { "start": "October 15, 66", "end": "October 15, 66" }, "josephus war 2": "555", "day": { "start": "-1388", "end": "-1388" }, "amd": { "start": 1485280, "end": 1485280 }, "sermon": "Revelation 8:12-13" }, { "title": "Nero orders Vespasian and Titus to invade Israel", "hebrew": { "start": "Heshvan 24, 4070", "end": "Heshvan 24, 4070" }, "macedonian": "Dius 24, 377", "gregorian": { "start": "October 31, 66", "end": "October 31, 66" }, "day": { "start": "-1373", "end": "-1373" }, "amd": { "start": 1485295, "end": 1485295 }, "sermon": "Revelation 9:1" }, { "title": "Five months lull in killing", "hebrew": { "start": "Heshvan 24, 4070 ", "end": "Vedar 25, 4066" }, "macedonian": "Dius 24, 377 - Dystos II 25, 377", "gregorian": { "start": "October 31, 66 ", "end": "March 28, 67" }, "day": { "start": "1373 ", "end": "1224" }, "amd": { "start": 1485295, "end": 1485444 }, "sermon": "Revelation 9:5,10" }, { "title": "Temple burned", "hebrew": { "start": "Ab 9, 4070", "end": "Ab 9, 4070" }, "macedonian": "Loos 9, 381", "gregorian": { "start": "August 4, 70", "end": "August 4, 70" }, "josephus war 6": "250", "day": { "start": "0", "end": "0" }, "amd": { "start": 1486668, "end": 1486668 } }, { "title": "Masada fell", "hebrew": { "start": "Nisan 15, 4074", "end": "Nisan 15, 4074" }, "macedonian": "Xanthicus 15, 385", "gregorian": { "start": "March 30, 74", "end": "March 30, 74" }, "day": { "start": "1335", "end": "1335" }, "amd": { "start": 1488003, "end": 1488003 }, "sermon": "Daniel 12:12" }];

},{}],2:[function(require,module,exports){
'use strict';

var timelineData = require('./timeline-data');

function splitUpRangesIntoTwoEvents(timelineData) {
	var dateFields = ['hebrew', 'macedonian', 'gregorian', 'day', 'amd'];
	var endingEvents = [];
	var startingDates = timelineData.map(function (event) {
		function eventWithoutDates() {
			return {
				sermon: event.sermon,
				title: event.title
			};
		}

		var newEvent = eventWithoutDates();
		var endingEvent = null;

		function setEndEvent(fieldName, endDate) {
			if (!endingEvent) {
				endingEvent = eventWithoutDates();
				endingEvent.end = true;
				newEvent.start = true;
			}
			endingEvent[fieldName] = endDate;
		}

		dateFields.filter(function (fieldName) {
			return event[fieldName].start !== event[fieldName].end;
		}).forEach(function (fieldName) {
			return setEndEvent(fieldName, event[fieldName].end);
		});

		dateFields.forEach(function (fieldName) {
			return newEvent[fieldName] = event[fieldName].start;
		});

		if (endingEvent) {
			endingEvents.push(endingEvent);
		}

		return newEvent;
	});
	return startingDates.concat(endingEvents).sort(function (a, b) {
		return a.amd - b.amd;
	});
}
new Ractive({
	el: '#timeline',
	template: '#body',
	data: {
		events: splitUpRangesIntoTwoEvents(timelineData)
	},
	oninit: function oninit() {
		var r = this;
	}
});

},{"./timeline-data":1}]},{},[2]);
