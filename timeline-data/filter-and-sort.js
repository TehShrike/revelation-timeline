const sortRange = require('./sort-range.js')

module.exports = timelineData => sortRange(timelineData.filter(
	event => event.amd.end > 1471937 && event.amd.start < 1488003
), event => [ event.amd.start, event.amd.end ])
