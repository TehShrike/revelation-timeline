const fs = require('fs')
const got = require('got')
const denodeify = require('then-denodeify')
const readFile = denodeify(fs.readFile)

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

async function main() {
	const markdown = await get()
	//fs.readFileSync('./timeline.md', { encoding: 'utf8' })

	const structure = matches(markdown).map(({ title, properties }) => {
		const newEvent = {
			title
		}
		copyAndElongatePropertyNames(properties, newEvent)

		// castToInt(newEvent, 'day')
		// gotta ignore 'day' until we figure out ranges with negative days

		castToInt(newEvent, 'amd')
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

function parseRange(str) {
	const match = /^(-?[^\-]+) *- *([^\-]+)/.exec(str)
	return match ? { start: match[1], end: match[2] } : { start: str, end: str }
}

function matches(str) {
	var match
	const regex = /^-\s*(.+?)((?:\n\t-\s*.+)+)/gm

	const output = []
	while ((match = regex.exec(str)) !== null) {
		output.push({
			title: match[1].trim(),
			properties: turnLinesToObject(parseChildLines(match[2]))
		})
	}

	return output
}

function parseChildLines(str) {
	var match
	const propertiesRegex = /^\t-\s*(.+)$/gm
	const output = []
	while ((match = propertiesRegex.exec(str)) !== null) {
		output.push(match[1].trim())
	}
	return output
}

function isShortDateFieldName(field) {
	return datePropertyNames.indexOf(field) >= 0
}

function turnLinesToObject(lines) {
	const o = {}

	lines.forEach(str => {
		const parts = str.split(/:\s*/)
		const secondPart = parts.slice(1).join(':').trim()

		if (secondPart) {
			const shortFieldName = parts[0].toLowerCase()
			o[shortFieldName] = isShortDateFieldName(shortFieldName) ? parseRange(secondPart) : secondPart
		}
	})

	return o
}

function copyAndElongatePropertyNames(o, target) {
	Object.keys(o).forEach(key => target[longPropertyNames[key] || key] = o[key])
}

function castToInt(o, property) {
	if (!o[property]) {
		return
	}
	const definitelyTruthyValue = o[property]

	switch (typeof definitelyTruthyValue) {
		case 'string':
			o[property] = parseInt(definitelyTruthyValue, 10)
			break
		case 'object':
			castToInt(definitelyTruthyValue, 'start')
			castToInt(definitelyTruthyValue, 'end')
			break
	}
}
