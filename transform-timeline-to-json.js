const fs = require('fs')
const got = require('got')
const denodeify = require('then-denodeify')
const readFile = denodeify(fs.readFile)
const {
	parseIntegerRange,
	parseAnyRange
} = require('./parse-range.js')

const longPropertyNames = {
	h: 'hebrew',
	s: 'macedonian',
	g: 'gregorian',
	r: 'reference'
}

// if a non-AMD date is empty or NA, ignore it
// collect all description lines (lines without an opening dash) into a single field/array


async function get() {
	const markdown = await readFile('./demo-input.md', { encoding: 'utf8' })
	// const { body: markdown } = got('https://content.kaysercommentary.com/Sermons/New%20Testament/Revelation/Revelation%20timeline.md')

	return markdown
}

const datePropertyNames = [ 'h', 'm', 'g', 'day', 'amd' ]
const integerDatePropertyNames = [ 'day', 'amd' ]

async function main() {
	const markdown = await get()
	//fs.readFileSync('./timeline.md', { encoding: 'utf8' })

	const structure = matches(markdown).map(({ title, properties }) => {
		const newEvent = {
			title
		}
		copyAndElongatePropertyNames(properties, newEvent)

		return newEvent
	}).sort((itemA, itemB) => {
		return itemA
	})

	fs.writeFileSync('./timeline-data.js', `module.exports = ${formattedJson(structure)}`)
}

main()




function formattedJson(structure) {
	return JSON.stringify(structure, null, '\t')
}

function matches(str) {
	var match
	const regex = /^-([^-].+?)\n((?:\n|(?:[^-].*\n))+)/gm

	const output = []
	while ((match = regex.exec(str)) !== null) {
		const [ , first, second ] = match

		if (first && second) {
			output.push({
				title: first.trim(),
				properties: turnLinesToObject(parseChildLines(second))
			})
		}
	}

	return output
}

function parseChildLines(str) {
	var match
	const propertiesRegex = /^\t-(.+)$/gm
	const output = []
	while ((match = propertiesRegex.exec(str)) !== null) {
		output.push(match[1].trim())
	}
	return output
}

function isShortDateFieldName(field) {
	return datePropertyNames.indexOf(field) >= 0
}

function isIntegerDateFieldName(field) {
	return integerDatePropertyNames.indexOf(field) >= 0
}

function rangeArrayToObject([ start, end ]) {
	return { start, end }
}

function turnLinesToObject(lines) {
	const o = {}

	lines.forEach(str => {
		const parts = str.split(/:\s*/)
		const secondPart = parts.slice(1).join(':').trim()

		if (secondPart) {
			const shortFieldName = parts[0].toLowerCase()

			if (isIntegerDateFieldName(shortFieldName)) {
				o[shortFieldName] = rangeArrayToObject(parseIntegerRange(secondPart))
			} else if (isShortDateFieldName(shortFieldName)) {
				o[shortFieldName] = rangeArrayToObject(parseAnyRange(secondPart))
			} else {
				o[shortFieldName] = secondPart
			}
		}
	})

	return o
}

function copyAndElongatePropertyNames(o, target) {
	Object.keys(o).forEach(key => target[longPropertyNames[key] || key] = o[key])
}
