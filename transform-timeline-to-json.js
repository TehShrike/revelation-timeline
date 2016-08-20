const fs = require('fs')
const markdown = fs.readFileSync('./timeline.md', { encoding: 'utf8' })



function matches(str) {
	var match
	const regex = /^-\s*(.+?)((?:\n\t-\s*.+)+)/gm

	const output = []
	while ((match = regex.exec(str)) !== null) {
		output.push({
			title: match[1],
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
		output.push(match[1])
	}
	return output
}

function turnLinesToObject(lines) {
	const o = {}

	lines.forEach(str => {
		const parts = str.split(/:\s*/)
		o[parts[0].toLowerCase()] = parts.slice(1).join('')
	})

	return o
}

matches(markdown).forEach(str => console.log(str))
