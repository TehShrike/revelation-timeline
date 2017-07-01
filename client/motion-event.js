import EventEmitter from 'eventemitter3'

const globalUpdateEmitter = new EventEmitter()

function debounce(fn) {
	var alreadyCalled = false
	return (...args) => {
		if (!alreadyCalled) {
			alreadyCalled = true
			window.requestAnimationFrame(() => {
				fn(...args)
				alreadyCalled = false
			})
		}
	}
}

const listener = debounce(() => globalUpdateEmitter.emit('update'))

window.addEventListener('resize', listener)
window.addEventListener('scroll', listener)

export default globalUpdateEmitter
