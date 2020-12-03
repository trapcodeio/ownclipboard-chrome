import {createRouter, createWebHashHistory} from 'vue-router';
import Online from '@/views/Online';
import Local from '@/views/Local';
import Write from '@/views/Write';
import Fav from '@/views/Fav';
import Settings from '@/views/Settings';

const routes = [
	{
		path: '/',
		name: 'local',
		component: Local,
	},
	{
		path: '/online',
		name: 'online',
		component: Online,
	},
	{
		path: '/fav',
		name: 'fav',
		component: Fav,
	},
	{
		path: '/write',
		name: 'write',
		component: Write,
	},
	{
		path: '/settings',
		name: 'settings',
		component: Settings,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
