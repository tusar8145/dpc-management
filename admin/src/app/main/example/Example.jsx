import DemoContent from '@fuse/core/DemoContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Icon, Grid, Button,Stack } from "@mui/material";
 
import { useEffect, useState } from 'react';
import _ from '@lodash';
import { useTheme } from '../../context/ThemeContext';
import '../../../styles/custom-header.css';
 
import axios from "axios";
//axios.defaults.headers.common['accessToken'] =  'JWT '+window.localStorage.getItem('accessToken');




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

function Example({ onData }) {
	const [img_col, setimg_col] = useState(null);

	const onFileChange = function (e) {
		e.preventDefault();
		setimg_col(e.target.files)
	  }

	  const doSomething = function (e) {
		  
		e.preventDefault();

		var formData = new FormData();
	  
		const fileInput = document.querySelector('input[type="file"]'); 
	   
	  
	  for (let y=0; y<fileInput.files.length; y++){
		//console.log(fileInput.files[y],'okk')
		formData.append(`file-${y}`, fileInput.files[y], fileInput.files[y].name);
		//console.log(formData,'formData')
	  }
	  
	  console.log(fileInput.files.length)

			fetch('http://localhost:8000/api/admin/uploads/'+fileInput.files.length, {
				method: 'POST',
				body: formData,
			})
	  
			.then((res) => res.json())
			.then((data) => {
				console.log('ffff',data)
			})
			.catch((err) => console.error(err, '2'));  
	  }

	  
	  
	const { t } = useTranslation('examplePage');

	const { theme, toggleTheme } = useTheme();
	const { hospital, toggleHospital } = useTheme();

	useEffect(() => { 
		toggleTheme(t('Dashboard'))
		toggleHospital(5)
	 }, [t('Dashboard')]);

	return (
		<Root
			header={
				<div className="p-24 hidden-on-large">
					<h4>{t('Dashboard')} </h4>
				</div>
			}
			content={
				<div className="p-24">
					<h4>Content</h4>

{hospital?.id}

 


					<br />
			 
				</div>
			}
		/>
	);
}

export default Example;
