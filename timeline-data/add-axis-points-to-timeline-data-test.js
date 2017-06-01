const tape = require('tape')

const addAxisPoints = require('./add-axis-points-to-timeline-data.js')

tape(`add axis points to timeline data`, t => {
	const axisData = [
		{
			axisPoint: 1471939,
			hebrew: 'Ab 16, 4030',
			macedonian: 'Xanthicus 16, 341',
			gregorian: 'April 6, 30',
			amd: 1471939
		}, {
			axisPoint: 1471955,
			hebrew: '4030',
			macedonian: '341',
			gregorian: 'April 22, 30',
			amd: 1471955
		}, {
			axisPoint: 1471977,
			hebrew: 'Iyar 24, 4030',
			macedonian: 'Xanthicus 24, 341',
			gregorian: 'May 14, 30',
			amd: 1471977
		}, {
			axisPoint: 1471982,
			type: 'snip',
			days: 2488,
			start: 1471982,
			end: 1474470
		}, {
			axisPoint: 1471987,
			hebrew: '4037',
			macedonian: '348',
			gregorian: 'March 16, 37',
			amd: 1474475
		}, {
			axisPoint: 1471992,
			type: 'snip',
			days: 1400,
			start: 1474480,
			end: 1475880
		}, {
			axisPoint: 1471997,
			hebrew: '4040',
			macedonian: '351',
			gregorian: 'January 24, 41',
			amd: 1475885
		}
	]

	const timelineData = [
		{
			title: 'Resurrection',
			hebrew: { start: 'Ab 16, 4030', end: 'Ab 16, 4030' },
			macedonian: { start: 'Xanthicus 16, 341', end: 'Xanthicus 16, 341' },
			gregorian: { start: 'April 6, 30', end: 'April 6, 30' },
			amd: { start: 1471939, end: 1471939 }
		}, {
			title: 'First Seal - Tiberius',
			hebrew: { start: '4030', end: '4037' },
			macedonian: { start: '341', end: '348' },
			gregorian: { start: 'April 22, 30', end: 'March 16, 37' },
			amd: { start: 1471955, end: 1474475 },
			reference: 'Revelation 6:1-2'
		}, {
			title: 'Ascension',
			hebrew: { start: 'Iyar 24, 4030', end: 'Iyar 24, 4030' },
			macedonian: { start: 'Xanthicus 24, 341', end: 'Xanthicus 24, 341' },
			gregorian: { start: 'May 14, 30', end: 'May 14, 30' },
			amd: { start: 1471977, end: 1471977 },
			reference: 'Revelation 4-5'
		}, {
			title: 'Second Seal - Caligula',
			hebrew: { start: '4037', end: '4040' },
			macedonian: { start: '348', end: '351' },
			gregorian: { start: 'March 16, 37', end: 'January 24, 41' },
			amd: { start: 1474475, end: 1475885 },
			reference: 'Revelation 6:3-4'
		}
	]

	const expected = [
		{
			title: 'Resurrection',
			hebrew: { start: 'Ab 16, 4030', end: 'Ab 16, 4030' },
			macedonian: { start: 'Xanthicus 16, 341', end: 'Xanthicus 16, 341' },
			gregorian: { start: 'April 6, 30', end: 'April 6, 30' },
			amd: { start: 1471939, end: 1471939 },
			axis: { start: 1471939, end: 1471939 }
		}, {
			title: 'First Seal - Tiberius',
			hebrew: { start: '4030', end: '4037' },
			macedonian: { start: '341', end: '348' },
			gregorian: { start: 'April 22, 30', end: 'March 16, 37' },
			amd: { start: 1471955, end: 1474475 },
			reference: 'Revelation 6:1-2',
			axis: { start: 1471955, end: 1471987 }
		}, {
			title: 'Ascension',
			hebrew: { start: 'Iyar 24, 4030', end: 'Iyar 24, 4030' },
			macedonian: { start: 'Xanthicus 24, 341', end: 'Xanthicus 24, 341' },
			gregorian: { start: 'May 14, 30', end: 'May 14, 30' },
			amd: { start: 1471977, end: 1471977 },
			reference: 'Revelation 4-5',
			axis: { start: 1471977, end: 1471977 }
		}, {
			title: 'Second Seal - Caligula',
			hebrew: { start: '4037', end: '4040' },
			macedonian: { start: '348', end: '351' },
			gregorian: { start: 'March 16, 37', end: 'January 24, 41' },
			amd: { start: 1474475, end: 1475885 },
			reference: 'Revelation 6:3-4',
			axis: { start: 1471987, end: 1471997 }
		}
	]

	const actual = addAxisPoints(axisData, timelineData)

	t.deepEqual(actual, expected)

	t.end()
})
