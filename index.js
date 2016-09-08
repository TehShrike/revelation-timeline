const timelineData = require('./timeline-data')


function splitUpRangesIntoTwoEvents(timelineData) {
	const dateFields = ['hebrew', 'macedonian', 'gregorian', 'day', 'amd']
	const endingEvents = []
	const startingDates = timelineData.map(event => {
		function eventWithoutDates() {
			return {
				sermon: event.sermon,
				title: event.title
			}
		}

		const newEvent = eventWithoutDates()
		let endingEvent = null

		function setEndEvent(fieldName, endDate) {
			if (!endingEvent) {
				endingEvent = eventWithoutDates()
				endingEvent.end = true
				newEvent.start = true
			}
			endingEvent[fieldName] = endDate
		}

		dateFields.filter(fieldName => event[fieldName].start !== event[fieldName].end)
			.forEach(fieldName => setEndEvent(fieldName, event[fieldName].end))

		dateFields.forEach(fieldName => newEvent[fieldName] = event[fieldName].start)

		if (endingEvent) {
			endingEvents.push(endingEvent)
		}

		return newEvent
	})
	return startingDates.concat(endingEvents).sort((a, b) => a.amd - b.amd)
}
new Ractive({
	el: '#timeline',
	template: '#body',
	data: {
		events: splitUpRangesIntoTwoEvents(timelineData)
	},
	oninit: function() {
		var r = this
	}
})