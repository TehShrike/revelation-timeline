module.exports = addSnipsToTimelineData

function addSnipsToTimelineData(axisPoints, timelineData) {
	const amdToAxisPoint = axisPoints.reduce((map, axis) =>
		(map[axis.amd] = axis.axisPoint, map),
		Object.create(null))

	return timelineData.map(data => {
		if (data.amd) {
			return Object.assign({
				axis: {
					start: amdToAxisPoint[data.amd.start],
					end: amdToAxisPoint[data.amd.end]
				}
			}, data)
		} else {
			return data
		}
	})
}

