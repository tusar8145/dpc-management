import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { memo, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import Button from '@mui/material/Button';
import CIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
/**
 * The SummaryWidget widget.
 */
function SummaryWidget(props) {
	const navigate = useNavigate();
	const { t } = useTranslation('shared-components');
	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
			<div className="flex items-center justify-between px-8 pt-12">
				<Typography
					className="px-16 text-lg font-medium tracking-tight leading-6 truncate"
					color="text.secondary"
				>
					{props.title}
				</Typography>


					{props.view==1 ?
					<Button  size="small" variant="contained" onClick={() => {
					//props.patientDetails(data)
						if(props.link){
							navigate('/hospital/dpc-analysis?hospitalization-days='+props.link);
						}
						
						if(props.type){
							navigate('/hospital/dpc-analysis?type='+props.type);
						}
					}}
					endIcon={<CIcon />}>
					{t('View Details')}
					</Button>

					:

					<IconButton
						aria-label="more"
						size="large"
						disabled="true"
					>
					<FuseSvgIcon  className="text-48" size={24} color="action" >{props.icon}</FuseSvgIcon>
					</IconButton>		
					}



				{/*<IconButton
					aria-label="more"
					size="large"
					disabled="true"
				>
					<FuseSvgIcon  className="text-48" size={24} color="action" >{props.icon}</FuseSvgIcon>
				</IconButton>*/}
			</div>

			<div className="text-center mt-8">
				<Typography className="text-7xl sm:text-8xl font-bold tracking-tight leading-none text-blue-500" style={{color:props.color}}>
				{props.count}
				</Typography>
			 
				{props.title && <Typography className="text-lg font-medium text-blue-600 dark:text-blue-500">{props.title}</Typography> }
			</div>

			<Typography
				className="flex items-baseline justify-center w-full mt-20 mb-24"
				color="text.secondary"
			>
				 
			</Typography>
		</Paper>
	);
}

export default memo(SummaryWidget);
