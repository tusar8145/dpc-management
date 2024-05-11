import i18next from 'i18next';
import en from './navigation-i18n/en';
import ja from './navigation-i18n/ja';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('ja', 'navigation', ja);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig = [
 


	{
		id: '1',
		title: 'Dashboard',
		translate: 'Dashboard',
		type: 'item',
		icon: 'material-outline:widgets',
		url: 'example'
	},
	{
		id: 'apps.ecommerce',
		title: 'Data registration',
		type: 'collapse',
		icon: 'heroicons-outline:menu-alt-2',
		translate: 'Dataregistration',
		children: [
			{
				id: 'e-commerce-products',
				title: 'Injury/illness name',
				translate: 'Injuryillnessname',
				type: 'item',
				icon: 'material-twotone:face_retouching_natural',
				url: 'data-registration/injury-illness',
				end: true
			},
			{
				id: 'e-commerce-product-detail',
				title: 'Medical practice',
			    translate: 'medicalPractice',
				type: 'item',
				icon: 'feather:activity',
				url: 'apps/e-commerce/products/1/a-walk-amongst-friends-canvas-print'
			},
			{
				id: 'e-commerce-new-product',
				title: 'Medicine',
				translate: 'Medicine',
				type: 'item',
				icon: 'material-outline:card_travel',
				url: 'apps/e-commerce/products/new'
			},
			{
				id: 'e-commerce-orders',
				title: 'Medicinal efficacy category',
				translate: 'MedicinalEfficacyCategory',
				type: 'item',
				icon: 'material-twotone:medical_services',
				url: 'apps/e-commerce/orders',
				end: true
			},
		]
	},

	{
		id: 'apps.ecommerce1',
		title: 'DPC management',
		type: 'collapse',
		icon: 'material-outline:auto_awesome_motion',
		translate: 'DPCManagement',
		children: [
			{
				id: 'e-commerce-products1',
				title: '1 layer',
				translate: 'A1layer',
				type: 'item',
				icon: 'material-outline:layers',
				url: 'apps/e-commerce/products',
				end: true
			},
			{
				id: 'e-commerce-product-detail1',
				title: '2 layers',
			    translate: 'A2layers',
				type: 'item',
				icon: 'material-outline:layers',
				url: 'apps/e-commerce/products/1/a-walk-amongst-friends-canvas-print'
			},
			{
				id: 'e-commerce-new-product1',
				title: '3 layers',
				translate: 'A3layers',
				type: 'item',
				icon: 'material-outline:layers',
				url: 'apps/e-commerce/products/new'
			},
			{
				id: 'e-commerce-orders1',
				title: 'Days and score settings',
				translate: 'DaysAndScoreSettings',
				type: 'item',
				icon: 'material-outline:event',
				url: 'apps/e-commerce/orders',
				end: true
			},
		]
	},

];
export default navigationConfig;
