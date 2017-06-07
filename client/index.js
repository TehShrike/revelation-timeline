import svelteQuerystringRouter from 'svelte-querystring-router'
const { attachQuerystringData, getCurrentParameters } = svelteQuerystringRouter

import Main from './Main.html'

import timelineData from '../timeline-data/timeline-data.js'

const component = new Main({
	target: document.querySelector('#timeline'),
	data: {
		timelineData, // no need to re-sort, is pre-sorted by transform-timeline-to-json.js
		querystringParameters: getCurrentParameters(),
	}
})

attachQuerystringData(component)
