const timelineData = require('./timeline-data')
const { createRegex, extractRangeFromMatch } = require('verse-reference-regex')
const match = require('better-match')
const { relative: sortRange } = require('multi-part-range-compare')
const rPad = require('right-pad')

const regex = createRegex()

const flatMap = (fn, ary) => ary.reduce((acc, element) => [ ...acc, ...fn(element) ], [])
const relationToTempleBurning = amd => amd - 1486668
const referenceToRange = ({ chapter, verse }) => [ chapter, verse || 0 ]

const withVerses = timelineData.map(event => {
	const referenceMatches = match(regex, event.reference)

	const revelationReferences = []

	referenceMatches.forEach(match => {
		const range = extractRangeFromMatch([ null, ...match ])
		if (range.book === 'Revelation') {
			const { start, end } = range
			revelationReferences.push({ start, end })
		}
	})

	return Object.assign({
		revelationReferences
	}, event)
})

// withVerses.forEach(({ revelationReferences, title, reference }) => {
// 	console.log({ title, reference })
// 	revelationReferences.forEach(reference => console.log(reference))
// 	console.log('---------------')
// })

const references = flatMap(({ title, amd, hebrew, revelationReferences }) => {
	return revelationReferences.map(reference => Object.assign({ reference }, {
		title,
		amd,
		hebrew,
	}))
}, withVerses).sort((a, b) => {
	return sortRange(
		referenceToRange(b.reference.start),
		referenceToRange(b.reference.start),
		referenceToRange(a.reference.start)
	)
})

const referenceToString = ({ chapter, verse }) => {
	return verse
		? `${chapter}:${verse}`
		: chapter.toString()
}
const referenceRangeToString = ({ start, end }) => {
	const same = end && end.chapter === start.chapter && end.verse === start.verse

	return same
		? referenceToString(start)
		: `${referenceToString(start)}-${referenceToString(end)}`
}
const templeRange = ({ start, end }) => {
	return end === start
		? relationToTempleBurning(start).toString()
		: `${relationToTempleBurning(start)} to ${relationToTempleBurning(end)}`
}

byVerse(references)
// byDate(references)

function byDate(references) {
	references
	.sort((a, b) => a.amd.start - b.amd.start)
	.forEach(({ reference, title, hebrew, amd }) => {
		console.log(
			rPad(hebrew.start, 18),
			rPad(templeRange(amd), 17),
			rPad(`Revelation ${referenceRangeToString(reference)}`, 23),
			title
		)
	})
}

function byVerse(references) {
	references
	.forEach(({ reference, title, hebrew, amd }) => {
		console.log(
			rPad(`Revelation ${referenceRangeToString(reference)}`, 23),
			rPad(hebrew.start, 18),
			rPad(templeRange(amd), 17),
			title
		)
	})
}
