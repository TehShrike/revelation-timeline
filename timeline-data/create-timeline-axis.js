const snipSectionsLongerThan = 100

const pipe = (input, ...fns) => fns.reduce((last, fn) => fn(last), input)
const flatMap = (fn, ary) => ary.reduce((acc, element) => [ ...acc, ...fn(element) ], [])
const safeGet = (object, property, ...rest) => {
	const nextObject = object && object[property]
	return rest.length > 0 ? safeGet(nextObject, ...rest) : nextObject
}
const getDates = (property, object) => ({
	hebrew: safeGet(object, 'hebrew', property),
	macedonian: safeGet(object, 'macedonian', property),
	gregorian: safeGet(object, 'gregorian', property),
	amd: safeGet(object, 'amd', property),
})

module.exports = createTimelineAxis
function createTimelineAxis(timelineData, snipBuffer) {
	const naiveAxisMarkers = flatMap(event => {
		return event.amd.start === event.amd.end
			? [ getDates('start', event) ]
			: [ getDates('start', event), getDates('end', event) ]
	}, timelineData).sort((a, b) => a.amd - b.amd)

	return pipe(naiveAxisMarkers,
		filterOutDuplicates,
		_ => addSnipEvents(_, snipBuffer),
		calculateAxisPoints
	)
}

function filterOutDuplicates(dates) {
	let last = null
	return dates.filter(date => {
		const keep = last !== date.amd
		last = date.amd
		return keep
	})
}

function addSnipEvents(dates, snipBuffer) {
	let lastDay = null

	return flatMap(date => {
		if (lastDay) {
			const delta = date.amd - lastDay
			if (delta > snipSectionsLongerThan) {
				const snipDays = delta - (snipBuffer * 2)
				const snip = {
					type: 'snip',
					days: snipDays,
					start: lastDay + snipBuffer,
					end: date.amd - snipBuffer
				}
				lastDay = date.amd
				return [ snip, date ]
			}
		}

		lastDay = date.amd

		return [ date ]
	}, dates)
}

// axis points: number of visible days from the top of the timeline
function calculateAxisPoints(dates) {
	let snippedSoFar = 0

	return dates.map(date => {
		if (date.type === 'snip') {
			const axisPoint = date.start - snippedSoFar
			snippedSoFar += date.days
			return Object.assign({ axisPoint }, date)
		} else {
			return Object.assign({
				axisPoint: date.amd - snippedSoFar
			}, date)
		}
	})
}

// console.log(createTimelineAxis(require('./filter-and-sort')(require('./timeline-data')), 5).map(date => {
// 	return Object.assign({
// 		afterCrucifixion: (date.start || date.amd) - 1471937
// 	}, date)
// }))
