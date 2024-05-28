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
import Grid from '@mui/material/Grid';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'app/store/hooks';

const FileChoose = lazy(() => import('../../shared-components/file-choose/FileChoose'));
const SearchInput = lazy(() => import('../../shared-components/search-input/SearchInput'));
const Table = lazy(() => import('../../shared-components/table/TableCommon'));
const ReportModal = lazy(() => import('../../shared-components/modal/ReportModal')); 
const ButtonThree = lazy(() => import('./Button'));
const TablePatient = lazy(() => import('../../shared-components/table/TablePatient'));
const Paginate = lazy(() => import('../../shared-components/card/Paginate'));
const Drawer = lazy(() => import('./Drawer'));

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

 


 
function DPCAnalysis() {
	const dispatch = useAppDispatch();

	let tableName='new'
	let headingTitle='DPC Analysis'
	let keyConfig=[
	  {name:'dpc', type:'String', header:'DPC First 6 Digits', edit:1, validate:{required:1},   	 xlsx:'MDCｺｰﾄﾞ<+>分類ｺｰﾄﾞ'},
	  {name:'name', type:'String', header:'Injury and disease name',edit:1, validate:{required:1},   xlsx:'ICD名称'},
	  {name:'icd', type:'String', header:'ICD Code', edit:1, validate:{required:1},  				 xlsx:'ICDｺｰﾄﾞ'},
	  {name:'receipt', type:'Integer', header:'ID',edit:0, validate:{required:0},   				 xlsx:'<auto>'}
	]


	const { t } = useTranslation('shared-components');

	function onSubmit(data) {
		console.log(data);
	}

	const [loading, setLoading] = useState(false);

    const [data, setData] = useState([]);
	const [dataFromChild, setDataFromChild] = useState("");
	const [start, setStart] = useState(0);
	const [count, setCount] = useState(null);
	const [progress, setProgress] = useState(0);
	const [allowUpload, setAllowUpload] = useState(0);
	const [showUpload, setShowUpload] = useState(1);
	const [textUpload, setTextUpload] = useState(null);

	const [successAlert, setSuccessAlert] = useState(null);
	const [failAlert, setFailAlert] = useState(null);
	const [resetComponents, setResetComponents] = useState(false);
	const [globalFilter, setGlobalFilter] = useState(null);
	const [fail_count_list, setFail_count_list] = useState(null);

	const [dpc_data, setDpc_data] = useState([]);

	const { theme, toggleTheme } = useTheme();
	const { hospital, toggleHospital } = useTheme();

	

	const [c_verified, setCverified] = useState(0);
	const [c_n_verified, setCNverified] = useState(0);

	const [pageP, setPageP] = useState(0);
	const [rowP, setRowP] = useState(10);
	const [total_data, setTotal_data] = useState(0);

	const [is_verified, setIs_verified] = useState(null);

	let sl=(pageP*rowP)+1;

	const [filter_days, setFilterDays] = useState(null);
	const [filter_code, setFilterCode] = useState(null);
	const [filter_ward, setFilterWard] = useState(null);
	const [filter_hospitalized, setHospitalized] = useState(null);

	/*-----------start common function shareable------------*/
	async function server(hospital,filter_codex) {
				 						

		try {
			 
				let skip=rowP*pageP
				let take=rowP
				let filter={
					...filter_codex?{patient_code:parseInt(filter_codex)}:{}
				}
				 

				const data = await axios.post(apiConfig.PatientDpcList +'?skip='+skip+'&take='+take, {hospital_id:hospital.id, is_verified:is_verified, ...filter?{ filter:filter }:{}});
				 
				let temp_count=data.data.data.count
				setDpc_data(data.data.data.list)


				let temp1=temp_count[0]?._count?.is_verified || 0
				let temp2=temp_count[1]?._count?.is_verified || 0


				setCNverified(temp1 || 0)
				setCverified(temp2 || 0)
			

				if(is_verified==1){ 
					setTotal_data(temp2 || 0)
				}
				else if(is_verified==0){ 
					setTotal_data(temp1 || 0)
				}
				else { 
					setTotal_data(temp1+temp2)
				}
				
		} catch (error) {
			//setFailAlert("Invalid File")
		}
	}
	/*---------end common function shareable---------*/

	function handleDataFromChild(data) {
		console.log(data,'tusar')
		if(data.length>0){
			setAllowUpload(true)
			setData(data)
		}
	}


	function handleCountDataFromChild(count) {
		if(!count>0){
			setTextUpload(t('Upload'))
		}else{
			setTextUpload(t('Data replacement'))
		}
		setCount(count)
	}


	function handleActionFromSearch(action) {
		console.log(action,'actionx')
		setShowUpload(action)
		setSuccessAlert(null)
		setFailAlert(null)
		setAllowUpload(false)
	}

	function handleSetGlobalFilter(data) {
			setGlobalFilter(data)
	}

	function setPageParent(val) {
		setPageP(val)	 
	}
	
	function setRowParent(val) {
		setRowP(val)	 
	}
	
	function setVerified(val) {
		setIs_verified(val)	 
	}
	function keyup(val) {
		setFilterCode(val)
	}
	function verify() {
		server(hospital,filter_code);   

		dispatch(showMessage({
			message: 'データの更新に成功しました',
			autoHideDuration: 2000,
			anchorOrigin: {
				vertical: 'top',
				horizontal: 'right'
			}
		}))

	}

	
	useEffect(() => { 
		server(hospital,filter_code);  
	
	}, [pageP, rowP, is_verified,filter_code]);


	useEffect(() => {  toggleTheme(t(headingTitle));   }, [t(headingTitle)]);

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
					{failAlert != null &&  <ReportModal data={fail_count_list}/> }


					<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
						<Grid item xs={5}>
							<ButtonThree setVerified={setVerified} c_n_verified={c_n_verified} c_verified={c_verified}/>
						</Grid>
						<Grid item xs={2}>
							<Drawer keyup={keyup}/>
						</Grid>
						<Grid item xs={5}>
							<Paginate total_data={total_data} setRowParent={setRowParent} setPageParent={setPageParent}/>
						</Grid>
					</Grid>
	

					<br/><br/>

					{dpc_data?.map(single => (
						<>
							<TablePatient className="mt-24" sl={sl++} data={single}   verify={verify}/>
							<br/><br/>
						</>
					))}


					{dpc_data.length == 0 &&
						<>
							<FuseSvgIcon className="text-48 mt-128" size={48} color="action">material-outline:error_outline</FuseSvgIcon>
							<i className='mt-24'>何もデータが見つかりませんでした</i>
						</>
					}




				</div>
			}
	/>

	);
}

export default DPCAnalysis;
