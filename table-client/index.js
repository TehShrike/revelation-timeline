import routerInstance from 'svelte-querystring-router'
const { attachQuerystringData, getCurrentParameters } = routerInstance

import TableMain from './TableMain.html'

import timelineData from '../client/timeline-data.js'


const component = new TableMain({
	target: document.querySelector('#target'),
	data: {
		timelineData,
		querystringParameters: getCurrentParameters(),
	}
})

attachQuerystringData(component)

