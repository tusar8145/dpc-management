import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import ja from './i18n/ja';
import {authRoles} from '../../auth';

i18next.addResourceBundle('en', 'dashboardPage', en);
i18next.addResourceBundle('tr', 'dashboardPage', tr);
i18next.addResourceBundle('ar', 'dashboardPage', ar);
i18next.addResourceBundle('ja', 'dashboardPage', ja);
const Dashboard = lazy(() => import('./Dashboard'));
/**
 * The Dashboard page config.
 */
const DashboardConfig = {
	settings: {
		layout: {}
	},
	auth    : authRoles.hospitalAssistant,
	routes: [
		{
			path: 'dashboard',
			element: <Dashboard />
		}
	]
};
export default DashboardConfig;
