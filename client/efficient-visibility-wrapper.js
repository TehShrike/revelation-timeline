import EfficientVisibility from './EfficientVisibility.html'
import debounce from './debounce-to-animation-frame.js'
import keyMaster from 'key-master'

const changeTracker = createChangeTracker()

const applyChanges = debounce(() => {
	const componentsToChange = keyMaster(() => ({}), new Map())
	const parentComponents = new Set()

	changeTracker.forEachEntry((component, change) => {
		const { parent, parentProperty, key } = change

		const componentChanges = componentsToChange.get(parent)
		parentComponents.add(parent)
		Object.assign(componentChanges, {
			[parentProperty]: Object.assign(componentChanges[parentProperty] || {}, {
				[key]: change
			})
		})
	})

	forOf(parentComponents.values(), parentComponent => {
		const changes = componentsToChange.get(parentComponent)
		parentComponent.set(changes)
	})

	changeTracker.clear()
})

export default function EfficientVisibilityWrapper(options) {
	const component = new EfficientVisibility(options)

	component.on('change', change => {
		if (change.parent) {
			changeTracker.add(component, change)
		}
		applyChanges()
	})

	return component
}

function createChangeTracker() {
	let visibilityComponentsToChanges = new WeakMap()
	let changedVisibilityComponents = new Set()

	return {
		add(component, change) {
			visibilityComponentsToChanges.set(component, change)
			changedVisibilityComponents.add(component)
		},
		clear() {
			visibilityComponentsToChanges = new WeakMap()
			changedVisibilityComponents = new Set()
		},
		forEachEntry(fn) {
			forOf(changedVisibilityComponents.keys(), component => {
				const change = visibilityComponentsToChanges.get(component)
				fn(component, change)
			})
		},
		changedComponents() {
			return changedVisibilityComponents.keys()
		},
	}
}

function forOf(iterable, fn) {
	for (const value of iterable) {
		fn(value)
	}
}
