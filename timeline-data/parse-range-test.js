const test = require('tape')
const { parseIntegerRange, parseAnyRange } = require('./parse-range.js')

test(`integer ranges`, t => {
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
		t.deepEqual(output, expectedOutput, input)
	})

	t.end()
})

test(`String ranges`, t => {
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
		t.deepEqual(output, expectedOutput, input)
	})

	t.end()
})
