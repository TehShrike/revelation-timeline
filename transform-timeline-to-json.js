const fs = require('fs')
const markdown = fs.readFileSync('./timeline.md', { encoding: 'utf8' })

function getLines(str) {
	var match
	const propertiesRegex = /^\t-\s*(.+)$/gm
	const output = []
	while ((match = propertiesRegex.exec(str)) !== null) {
		output.push(match[1])
	}
	return output
}

function matches(str) {
	var match
	const regex = /^-\s*(.+?)((?:\n\t-\s*.+)+)/gm

	const output = []
	while ((match = regex.exec(str)) !== null) {
		output.push({
			title: match[1],
			properties: getLines(match[2])
		})
	}

	return output
}

matches(markdown).forEach(str => console.log(str))
