import { darken, styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useAppSelector } from 'app/store/hooks';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import '../../../styles/custom-header.css';
import FuseSvgIcon from '../../../@fuse/core/FuseSvgIcon';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useMemo,useEffect, useState } from 'react';

import axios from 'axios';
import apiConfig from '../../configs/apiConfig';


const Root = styled('div')(({ theme }) => ({
	'& .username, & .email': {
		transition: theme.transitions.create('opacity', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	},
	'& .avatar': {
		background: darken(theme.palette.background.default, 0.05),
		transition: theme.transitions.create('all', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		}),
		bottom: 0,
		'& > img': {
			borderRadius: '50%'
		}
	}
}));

/**
 * The user navbar header.
 */

const countries = [
	{ code: 'AI', label: '&Neo Administrator'},
    { code: 'AL', label: 'Daichan Hospital'},
    { code: 'AM', label: 'Gani hospital'},
	{ code: 'AM', label: 'Hospital 3'},
];


function HospitalNavbarHeader() {
	const { t } = useTranslation('shared-components');
	const { hospital, toggleHospital } = useTheme();
	const [age, setAge] = React.useState('*');
	const [hospitals, setHospitals] = React.useState([]);

	async function hospitalFetch() {
		const response = await axios.post(apiConfig.hospitalList,{});
		let res=response.data.data
		let new_obj=[]
		for (let x = 0; x < res.length; x++) {


			let f1=res[x].name.substring(0,22)

			if(res[x].name.length>22){
				f1=f1+'..'
			}
			new_obj.push({
				id: res[x].id,
				logo: res[x].logo,
				name: res[x].name,
				sort_name:f1,
				email: res[x].email,
			}
		  )
		}
		setHospitals(new_obj);
	}


	useEffect(() => {
		hospitalFetch()
	}, []);

	const handleChange = (event) => {
		if(event.target.value>0){
					toggleHospital({id:event.target.value, name:'xyz'})

		}

		setAge(event.target.value);
	};

	const user = useAppSelector(selectUser);
	return (
		<Root className="user relative flex flex-col items-center justify-center p-16 pb-14 shadow-0">
		
			<div className='view-as'>
				<Typography className="mb-6 username whitespace-nowrap text-14 font-medium  flex items-left pl-10 ">
				<FuseSvgIcon className="text-48" size={24} color="action" >heroicons-outline:eye</FuseSvgIcon>	 {t('View as')+':'}
				</Typography>


				<div className=" flex items-center justify-center ">
					<FormControl sx={{ m: 1, minWidth: 230 }} className='bg-[#0043CB] rounded-md' >
						<InputLabel id="demo-simple-select-helper-label">Select</InputLabel>
						<Select

							labelId="demo-simple-select-helper-label"
							id="demo-simple-select-helper"
							value={age}
							label="Age"
							onChange={handleChange}
						>
							<MenuItem value="*">{t('ALL Hospital')}</MenuItem>

							{hospitals.map((_item) => (
								<MenuItem value={_item.id}>{_item.sort_name}</MenuItem>
							))}

							

						</Select>
					</FormControl>
				</div>


			</div>

	</Root>

		/*<Root className="user relative   items-center justify-center p-16 pb-14 shadow-0">
			<div className="mb-24 flex items-center justify-center bg-[#0043CB]">
			<Typography className="username whitespace-nowrap text-14 font-medium">
				View As
			</Typography>

			<Typography variant="h4" gutterBottom>
			View As
      </Typography>
      <Typography variant="h5" gutterBottom>
      
						<FormControl sx={{ m: 1, minWidth: 230 }} >
					<InputLabel id="demo-simple-select-helper-label">Select</InputLabel>
					<Select
					labelId="demo-simple-select-helper-label"
					id="demo-simple-select-helper"
					value={age}
					label="Age"
					onChange={handleChange}
					>
					<MenuItem value="">
					</MenuItem>
					<MenuItem value={1}>&Neo Administrator</MenuItem>
					<MenuItem value={2}>Daichan Hospital</MenuItem>
					<MenuItem value={3}>Gani hospital</MenuItem>
					<MenuItem value={4}>Hospital 3</MenuItem>
					</Select>
				</FormControl>	  

      </Typography>
			 

			</div>
	
		</Root>*/
	);
}

export default HospitalNavbarHeader;


