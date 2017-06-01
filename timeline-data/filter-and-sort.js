const sortRange = require('./sort-range.js')

module.exports = (timelineData, minimumLength = 1) => sortRange(timelineData.filter(
	event => event.amd.end > 1471937 && event.amd.start < 1488003
		&& (event.amd.end - event.amd.start + 1) >= minimumLength
), event => [ event.amd.start, event.amd.end ])
