import EventEmitter from 'eventemitter3'

const globalUpdateEmitter = new EventEmitter()

function debounce(fn) {
	let alreadyCalled = false
	return (...args) => {
		if (!alreadyCalled) {
			alreadyCalled = true
			window.requestAnimationFrame(() => {
				alreadyCalled = false
				fn(...args)
			})
		}
	}
}

const listener = debounce(() => globalUpdateEmitter.emit('update'))

window.addEventListener('resize', listener)
window.addEventListener('scroll', listener)

export default globalUpdateEmitter
