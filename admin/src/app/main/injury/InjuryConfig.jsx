import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import ja from './i18n/ja';

i18next.addResourceBundle('en', 'InjuryPage', en);
i18next.addResourceBundle('tr', 'InjuryPage', tr);
i18next.addResourceBundle('ar', 'InjuryPage', ar);
i18next.addResourceBundle('ja', 'InjuryPage', ja);
const Injury = lazy(() => import('./Injury'));
/**
 * The Injury page config.
 */
const InjuryConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'injury',
			element: <Injury/>
		}
	]
};
export default InjuryConfig;
