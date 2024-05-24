import Button from '@mui/material/Button';
import _ from '@lodash';
import { useEffect, useState } from 'react';
import { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import axios from 'axios';
import apiConfig from '../../configs/apiConfig';
import Alert from '@mui/material/Alert';
import {createdAt} from '../../helpers/timeHelpers';
import {filterItemsEqual} from '../../helpers/commonHelpers';
import SummaryWidget from '../../shared-components/card/SummaryWidget';
import { motion } from 'framer-motion';
import  User  from '../../auth/user/user';
import { changeFuseTheme } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { useAppDispatch } from 'app/store/hooks';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));







 
function Dashboard() {
	//const dispatch = useAppDispatch();
 
	let user=User()
	if(user.role != 'admin'){
		let _theme={
				
			"id": "Emarald Gold",
			"section": {
				"main": {
					"palette": {
						"mode": "light",
						"primary": {
							"main": "#00695C",
							"light": "#439889",
							"dark": "#003D33",
							"contrastText": "rgb(255,255,255)"
						},
						"secondary": {
							"main": "#FFD740",
							"light": "#FFFF74",
							"dark": "#C8A600",
							"contrastText": "rgb(17, 24, 39)"
						},
						"background": {
							"default": "#dcf2f2",
							"paper": "#f2fdfa"
						},
						"text": {
							"primary": "rgb(17, 24, 39)",
							"secondary": "rgb(107, 114, 128)",
							"disabled": "rgb(149, 156, 169)"
						},
						"divider": "#b3c4c3"
					}
				},
				"navbar": {
					"palette": {
						"mode": "dark",
						"primary": {
							"main": "#00695C",
							"light": "#439889",
							"dark": "#003D33",
							"contrastText": "rgb(255,255,255)"
						},
						"secondary": {
							"main": "#FFD740",
							"light": "#FFFF74",
							"dark": "#C8A600",
							"contrastText": "rgb(17, 24, 39)"
						},
						"background": {
							"default": "#004D40",
							"paper": "#00544a"
						},
						"text": {
							"primary": "rgb(255,255,255)",
							"secondary": "rgb(148, 163, 184)",
							"disabled": "rgb(156, 163, 175)"
						},
						"divider": "#2d6360"
					}
				},
				"toolbar": {
					"palette": {
						"mode": "light",
						"primary": {
							"main": "#00695C",
							"light": "#439889",
							"dark": "#003D33",
							"contrastText": "rgb(255,255,255)"
						},
						"secondary": {
							"main": "#FFD740",
							"light": "#FFFF74",
							"dark": "#C8A600",
							"contrastText": "rgb(17, 24, 39)"
						},
						"background": {
							"default": "#dcf2f2",
							"paper": "#f2fdfa"
						},
						"text": {
							"primary": "rgb(17, 24, 39)",
							"secondary": "rgb(107, 114, 128)",
							"disabled": "rgb(149, 156, 169)"
						},
						"divider": "#b3c4c3"
					}
				},
				"footer": {
					"palette": {
						"mode": "dark",
						"primary": {
							"main": "#00695C",
							"light": "#439889",
							"dark": "#003D33",
							"contrastText": "rgb(255,255,255)"
						},
						"secondary": {
							"main": "#FFD740",
							"light": "#FFFF74",
							"dark": "#C8A600",
							"contrastText": "rgb(17, 24, 39)"
						},
						"background": {
							"default": "#004D40",
							"paper": "#00544a"
						},
						"text": {
							"primary": "rgb(255,255,255)",
							"secondary": "rgb(148, 163, 184)",
							"disabled": "rgb(156, 163, 175)"
						},
						"divider": "#2d6360"
					}
				}
			}
		
		}
 
		  //dispatch(changeFuseTheme(_theme?.section)).then(() => { });
 
	}
 
	let tableName=''
	let headingTitle='Dashboard'
  
	const { t } = useTranslation('shared-components');
 

	const [loading, setLoading] = useState(false);
 
 
	const [successAlert, setSuccessAlert] = useState(null);
	const [failAlert, setFailAlert] = useState(null);
 
	const { theme, toggleTheme } = useTheme();
	const { hospital, toggleHospital } = useTheme();
	
	useEffect(() => {  toggleTheme(t(headingTitle))  }, [t(headingTitle)]);


	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};
	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	const [countHospital, setCountHospital] = useState(0);
	const [countAdmin, setCountAdmin] = useState(0);
	const [countAssistant, setCountAssistant] = useState(0);
	const [countStaff, setCountStaff] = useState(0);

	const [count3rd, setCount3rd] = useState(0);
	const [count7th, setCount7th] = useState(0);
	const [countAll, setCountAll] = useState(0);
	const [countDischarged, setCountDischarged] = useState(0);
	const [countWithC, setCountWithC] = useState(0);


	async function dashboardCount(){
		let data = await axios.post(apiConfig.countAdminGroup, {});
		let getData=data.data.count

		for(let x=0; x<getData.length; x++){
			let this_=getData[x]

			if(this_.role=='admin'){setCountAdmin(this_._count.id)}
			if(this_.role=='hospitalAssistant'){setCountAssistant(this_._count.id)}
			if(this_.role=='staff'){setCountStaff(this_._count.id)}
 	
		}


		 data = await axios.post(apiConfig.countHospital, {});
		 getData=data.data.count._count.id
		 setCountHospital(getData)
		  
	}
	 
	useEffect(() => {  
		dashboardCount()
	}, []);







	return (
		<Root
			header={
				<div className="p-24 hidden-on-large">
					<h4>{t(headingTitle)} </h4>
				</div>
			}
			content={
				<div className="flex flex-col items-center p-24 sm:p-40 container">

 					
					{successAlert != null && <Alert severity="success">{t(successAlert)}.</Alert>}
					{failAlert != null && <Alert severity="error">{t(failAlert)}..</Alert>}
		
					{user?.role=='admin' &&
						<motion.div
							className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24 w-full min-w-0 py-24"
							variants={container}
							initial="hidden"
							animate="show"
						>
							<motion.div variants={item}>
								<SummaryWidget count={countHospital}   title={t('Hospitals')} icon={'material-outline:local_hospital'}/>
							</motion.div>

							<motion.div variants={item}>
								<SummaryWidget count={countAdmin}   title={t('Admin')}  icon={'heroicons-outline:user-circle'}/>
							</motion.div>

							<motion.div variants={item}>
								<SummaryWidget count={countHospital}   title={t('Hospital Assistant')}  icon={'heroicons-outline:user'}/>
							</motion.div>

							<motion.div variants={item}>
								<SummaryWidget count={countStaff}   title={t('Hospital Staff')}  icon={'heroicons-outline:user-group'}/>
							</motion.div>
						</motion.div>
					}

					{user?.role!='admin' &&
											<motion.div
											className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24 w-full min-w-0 py-24"
											variants={container}
											initial="hidden"
											animate="show"
										>
											<motion.div variants={item}>
												<SummaryWidget count={count3rd}   title={t('3rd Day')} icon={'material-outline:bedtime'}/>
											</motion.div>
				
											<motion.div variants={item}>
												<SummaryWidget count={count7th}   title={t('7th Day')}  icon={'material-outline:bedtime'}/>
											</motion.div>
				
											<motion.div variants={item}>
												<SummaryWidget count={countAll}   title={t('All  Patients')}  icon={'material-outline:bedtime'}/>
											</motion.div>
				
											<motion.div variants={item}>
												<SummaryWidget count={countDischarged}   title={t('Discharged Patient')}  icon={'material-outline:bedtime'}/>
											</motion.div>

											<motion.div variants={item}>
												<SummaryWidget count={countWithC}   title={t('With Change')}  icon={'material-outline:bedtime'}/>
											</motion.div>
										</motion.div>
					}

				</div>
			}
	/>

	);
}

export default Dashboard;
