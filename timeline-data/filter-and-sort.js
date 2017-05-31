module.exports = timelineData => timelineData.filter(
	event => event.amd.end > 1471937 && event.amd.start < 1488003
).sort((itemA, itemB) => {
	return itemA.amd.start - itemB.amd.start
})
