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
import { display, padding } from '@mui/system';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import * as FileSaver from 'file-saver';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Download';
 

import * as XLSX from 'xlsx';

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

	const [loading, setLoading] = useState(true);

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


	const [single_patient, setsingle_patient]   = useState([]);

	const [newval, setnewval] = useState('');

	/*-----------start common function shareable------------*/
	async function server(hospital,filter_codex) {
				 						
		console.log(filter_codex)

		try {
			 
				let skip=rowP*pageP
				let take=rowP
				let filter={
					...filter_codex?{patient_code:parseInt(filter_codex)}:{}
				}
				 

				const data = await axios.post(apiConfig.PatientDpcList +'?skip='+skip+'&take='+take, {hospital_id:hospital.id, is_verified:is_verified, ...filter?{ filter:filter }:{}});
				 
				let temp_count=data.data.data.count
				setDpc_data(data.data.data.list)
				setLoading(false)

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



	function Export  (exceldata,filename) {


			 try {
					console.log(exceldata,'collection',filename)
				
					const fileType= 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset-UTF-8';
					const fileExtension = '.xlsx';
			
					const ws = XLSX.utils.json_to_sheet(exceldata);
					const wb = {Sheets: {'data': ws}, SheetNames: ['data']};
					const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
					const data = new Blob ([excelBuffer], {type:fileType});
					FileSaver.saveAs(data, filename+fileExtension)	
			} catch (error) {
				
			} 

	   
	 
	  }


	async function download(hospital,filter_codex) {
		
		try {

	 
			var scale=50
		  
			let total=total_data
			var per_page=0
			var total_page=0
			var last_page=0

					if(total>scale){
						per_page=scale
					
						total_page=parseInt(total/per_page)
						last_page=total-total_page*per_page 
					
					}else{
						total_page=0
						last_page=total
					}

			 
					const collection=[]
					let report_name=''
					console.log('jjjjjjjjjj','dddddddddddd',total_page,last_page,per_page)

					let filter={
						...filter_codex?{patient_code:parseInt(filter_codex)}:{}
					}


			for (var i = 0; i <= total_page; i++) {
				var skip = i * per_page
				var get_items = per_page
				if (i == total_page) {
					get_items = last_page
				}

				let com = parseInt(((i + 1) / total_page) * 100)
			 
				//setcompleted(com)

				
				console.log({hospital_id:hospital.id, is_verified:is_verified, ...filter?{ filter:filter }:{}})
				const data = await axios.post(apiConfig.PatientDpcList +'?skip='+skip+'&take='+per_page, {hospital_id:hospital.id, is_verified:is_verified, ...filter?{ filter:filter }:{}});
				 
				console.log(data,'hhh')

				for (var j = data.data.data.list.length - 1; j > -1; j--) {
				 
					var obj = data.data.data.list[j];

					collection.push({
						'患者 コード':obj.patient_code,
						'病棟':obj.ward,
						'入院日':obj.admission_date,
						'退院 予定日':obj.discharge_date,
						'入院 日数':obj.hospitalization_days,
						'DPCコード':obj.dpc_6+obj.and_1+obj.age_1+obj.sur_2+obj.tre1_1+obj.tre2_1+obj.sec_1+obj.sco_1
					});
				} 
			}; 

				console.log(collection,'dddddddddddd')
				Export(collection,'DPC EXPORT')
 
				
		} catch (error) {
			console.log(error,'dddddddddddd')
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
	function keyup(event) {
		setFilterCode(event.target.value)
		setnewval(event.target.value)
		console.log(event.target.value)
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

	function patientDetails(val) {
		//let js=JSON.parse(val)
	// console.log(dpc_data,'xxx')
		//setsingle_patient(val)
		let arr_amount=JSON.parse(val.arr_amount)
		let arr_date=JSON.parse(val.arr_date)
		let arr_dept=JSON.parse(val.arr_dept)
		let arr_disease=JSON.parse(val.arr_disease)
		let arr_doctor=JSON.parse(val.arr_doctor)
		let arr_name=JSON.parse(val.arr_name)
		let arr_receipt=JSON.parse(val.arr_receipt)

		let obj_ = arr_receipt.map((value, index) => ({ receipt: value, name: arr_name[index], doctor: arr_doctor[index], disease: arr_disease[index], dept: arr_dept[index], date: arr_date[index], amount: arr_amount[index] }));
		setsingle_patient({all:obj_,ward:val.ward,dpc_data:val})
		 //console.log({all:obj_,ward:val.ward})
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
						<Grid item xs={4}>
							<ButtonThree setVerified={setVerified} c_n_verified={c_n_verified} c_verified={c_verified}/>
						</Grid>
						<Grid item xs={2}>
<p style={{display:"none"}} >
							 <Drawer single_patient={single_patient} keyup={keyup}  className="hidden"verify={verify}/> 

</p>
			 
<TextField id="standard-basic" label="患者コード" className="ml-10" style={{width:'100%' }} onChange={keyup}	value={newval} variant="standard" />

						</Grid>
						<Grid item xs={1} className='text-right'>

				 

							<Button size="small" variant="" style={{'border':'1px'}}

								onClick={() => {
									download(hospital, filter_code)
								}}


								endIcon={<Close />}>
								輸出
							</Button>
						</Grid>
						<Grid item xs={5}>
							<Paginate total_data={total_data} setRowParent={setRowParent} setPageParent={setPageParent}/>
						</Grid>
					</Grid>
	

					<br/><br/>

					{dpc_data?.map(single => (
						<>
							<TablePatient className="mt-24 " patientDetails={patientDetails} sl={sl++} data={single}   verify={verify}/>
							<br/><br/>
						</>
					))}


					{dpc_data.length == 0 && loading==false &&
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
