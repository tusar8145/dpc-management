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
				url: 'data-registration/medical-practice'
			},
			{
				id: 'e-commerce-new-product',
				title: 'Medicine',
				translate: 'Medicine',
				type: 'item',
				icon: 'material-outline:card_travel',
				url: 'data-registration/medicine'
			},
			{
				id: 'e-commerce-orders',
				title: 'Medicinal efficacy category',
				translate: 'MedicinalEfficacyCategory',
				type: 'item',
				icon: 'material-twotone:medical_services',
				url: 'data-registration/medicinal-efficacy',
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
				id: 'pages.invoice.printable',
				title: '1 layer',
				translate: 'A1layer',
				type: 'collapse',
				icon: 'material-outline:filter_1',
 
				children: [
					{
						id: 'pages.invoice.printable.compact',
						title: 'ICD to DPC',
						translate: 'ICDtoDPC',
						type: 'item',
						icon: 'material-outline:layers',
						url: 'dpc-management/icd-dpc'
					},
					{
						id: 'pages.invoice.printable.modern',
						title: 'Age birth weight',
						translate: 'AgeBirthWeight',
						type: 'item',
						icon: 'material-outline:layers',
						url: 'dpc-management/age-birth-weight'
					}
				]


			},
			{
				id: 'pages3.invoice3.printable',
				title: '2 layers',
			    translate: 'A2layers',
				type: 'item',
				icon: 'material-outline:filter_2',
				url: 'dpc-management/surgery'
			},
			{
				id: 'pages2.invoice2.printable',
				title: '3 layers',
				translate: 'A3layers',
				type: 'collapse',
				icon: 'material-outline:filter_3',
				children: [
					{
						id: 'pages2.invoice2.printable.compact',
						title: 'Treatement 1',
						translate: 'Treatement1',
						type: 'item',
						icon: 'material-outline:layers',
						url: 'dpc-management/treatement-1'
					},
					{
						id: 'pages2.invoice2.printable.modern',
						title: 'Treatement 2',
						translate: 'Treatement2',
						type: 'item',
						icon: 'material-outline:layers',
						url: 'dpc-management/treatement-2'
					},
					{
						id: 'pages2.invoice2.printable.modern2',
						title: 'Secondary Injury',
						translate: 'SecondaryInjury',
						type: 'item',
						icon: 'material-outline:layers',
						url: 'dpc-management/secondary-injury'
					}
				]
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
