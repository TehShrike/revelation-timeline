const sortRange = require('./sort-range.js')

module.exports = addAxisPointsToTimelineData

function addAxisPointsToTimelineData(axisPoints, timelineData) {
	sortRange()
}

test()

function test() {
	const timelineData = require('./timeline-data')
	const axisPoints = require('./create-timeline-axis.js')(require('./filter-and-sort')(timelineData), 5)
	console.log(addAxisPointsToTimelineData(axisPoints, timelineData))
}
