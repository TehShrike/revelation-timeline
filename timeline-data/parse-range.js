const r = require('regex-fun')

module.exports = {
	parseIntegerRange,
	parseAnyRange
}

const number = /-?\d+/
const optionalSpaces = / */
const separator = r.either('-', r.combine(' to '))
const captureIf = (condition, value, regex) => condition === value ? r.capture(regex) : regex
const range = captureNumber => r.combine(
	'[',
	captureIf(captureNumber, 0, number),
	separator,
	captureIf(captureNumber, 1, number),
	']'
)

const integerRangeRegex = r.combine(
	/^/,
	optionalSpaces,
	r.either(r.capture(number), range(0)),
	r.optional(
		optionalSpaces,
		separator,
		optionalSpaces,
		r.either(r.capture(number), range(1))
	),
	optionalSpaces,
	/$/
)

function parseIntegerRange(string) {
	const match = integerRangeRegex.exec(string)

	if (!match) {
		return null
	}

	const [ , ...captures ] = match

	const matchedNumbers = captures.filter(capture => capture)

	return [ parseInt(matchedNumbers[0], 10), parseInt(matchedNumbers[matchedNumbers.length - 1], 10) ]
}

const anyRangeRegex = r.combine(
	/^/,
	optionalSpaces,
	r.capture(r.oneOrMoreNonGreedy(/[^\n]/)),
	r.optional(
		optionalSpaces,
		separator,
		optionalSpaces,
		r.capture(r.oneOrMoreNonGreedy(/[^\n]/))
	),
	optionalSpaces,
	/$/
)

function parseAnyRange(string) {
	const match = anyRangeRegex.exec(string)

	if (!match) {
		return null
	}

	const [ , ...captures ] = match
	const truthyCaptures = captures.filter(str => str)

	return [ truthyCaptures[0], truthyCaptures[truthyCaptures.length - 1] ]
}


// test()

function test() {
	const assert = require('power-assert')

	const integerTests = [
		[ '1471955 - 1474475', [ 1471955, 1474475 ] ],
		[ ' 1471955 - 1474475', [ 1471955, 1474475 ] ],
		[ '-1373 to -1224', [ -1373, -1224 ] ],
		[ ' -1373 to -1224', [ -1373, -1224 ] ],
		[ '1485295-1485444', [ 1485295, 1485444 ] ],
		[ '[1483532-1483647] - 1485114', [ 1483532, 1485114 ] ],
		[ '1480895-[1483532-1483647]', [ 1480895, 1483647 ] ],
		[ '-1260', [ -1260, -1260 ] ],
		[ '1260-0', [ 1260, 0 ] ],
		[ '0', [ 0, 0 ] ],
		[ '-1260 - 1200', [ -1260, 1200 ] ],
		[ 'butts', null ],
		[ '123-nope', null ],
		[ 'invalid123-124', null ]
	]

	integerTests.forEach(([ input, expectedOutput ]) => {
		const output = parseIntegerRange(input)
		console.log('Parsing', input)
		assert.deepStrictEqual(output, expectedOutput)
		console.log('Test passed!')
	})

	const stringTests = [
		[ 'August 1, 588 BC', [ 'August 1, 588 BC', 'August 1, 588 BC' ] ],
		[ 'Xanthicus 24, 341', [ 'Xanthicus 24, 341', 'Xanthicus 24, 341' ] ],
		[ 'April 22, 30 - March 16, 37', [ 'April 22, 30', 'March 16, 37' ] ],
		[ '4030-4037', [ '4030', '4037' ] ],
		[ '4037 - 4040', [ '4037', '4040' ] ],
		[ 'March 16, 37 - January 24, 41', [ 'March 16, 37', 'January 24, 41' ] ]
	]

	stringTests.forEach(([ input, expectedOutput ]) => {
		const output = parseAnyRange(input)
		console.log('Parsing', input)
		assert.deepStrictEqual(output, expectedOutput)
		console.log('Test passed!')
	})
}
