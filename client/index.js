import Main from './Main.html'

import timelineData from '../timeline-data/timeline-data.js'


new Main({
	target: document.querySelector('#timeline'),
})

const lol = () => console.log('butts', timelineData.length)

lol()
