import Button from '@mui/material/Button';
import _ from '@lodash';
import { useEffect, useState } from 'react';
import { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import axios from 'axios';
import apiConfig from '../../../configs/apiConfig';
import Alert from '@mui/material/Alert';
import {createdAt} from '../../../helpers/timeHelpers';
import {filterItemsEqual} from '../../../helpers/commonHelpers';
import { motion } from 'framer-motion';
import  User  from '../../../auth/user/user';
 

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


 
 
function Hospital() {

 
	let user=User()
 
	let tableName=''
	let headingTitle='Hospital Management'
  
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
 
				</div>
			}
	/>

	);
}

export default Hospital;
