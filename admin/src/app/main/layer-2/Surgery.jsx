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

const FileChoose = lazy(() => import('../../shared-components/file-choose/FileChoose'));
const SearchInput = lazy(() => import('../../shared-components/search-input/SearchInput'));
const Table = lazy(() => import('../../shared-components/table/TableCommon'));

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



let tableName='surgery'
let headingTitle='Surgery'
let keyConfig=[
  {name:'dpc', type:'String', header:'DPC First 6 Digits', edit:1, validate:{required:1}},
  {name:'code', type:'String', header:'Compatible code', edit:1, validate:{required:1}},
  {name:'k_code', type:'String', header:'K Code', edit:1, validate:{required:1}},
  {name:'receipt', type:'Integer', header:'ID',edit:0, validate:{required:0}}
]




 
function Surgery() {
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
	const [showUpload, setShowUpload] = useState(0);
	const [textUpload, setTextUpload] = useState(null);

	const [successAlert, setSuccessAlert] = useState(null);
	const [failAlert, setFailAlert] = useState(null);
	const [resetComponents, setResetComponents] = useState(false);
	const [globalFilter, setGlobalFilter] = useState(null);


	async function server(type) {

		try {
			//if(type=='replace'){
					const illnessClear = await axios.post(apiConfig.tableClear + tableName+'/remove-all', {});
			//	}
			
				let clock=createdAt()
				let fail_count=0
				let obj = []
				let obj_col=[]
				var counts = 0
				var done = 0
				let len = data.length
				let recept=1
				for (var i = 0; i < len; i++) {
					let this_ = data[i]
					
					if(this_['MDCｺｰﾄﾞ'] || this_['分類ｺｰﾄﾞ'] || this_['対応ｺｰﾄﾞ'] || this_['__EMPTY_1']){
						obj.push({

							
							"receipt": recept,
							"dpc": (this_['MDCｺｰﾄﾞ']+this_['分類ｺｰﾄﾞ']).toString(),
							"code": this_['対応ｺｰﾄﾞ'],
							"k_code": this_['__EMPTY_1'],
			 
							
							"created_at":clock,
							"updated_at":clock,
							"created_by": 1
						})
						recept++				
					}else{
						fail_count++
					}


					done++

					if ((counts == 1000) || (i == parseInt(len) - 1)) {
						console.log(counts, i, len)
						var cal_per = parseInt((done / len) * 100)
						setProgress(cal_per)

						obj_col[done]=obj

						const response = await axios.post(apiConfig.tableCreate + tableName+'/create', obj);
						obj = []
						counts = 0
					}
					counts++
				}

				if(fail_count==0){setSuccessAlert("Data uploaded successfully")}else{setFailAlert(fail_count+ " Data upload failed")}
				
				setShowUpload(0)
				setProgress(0)			
		} catch (error) {
			setProgress(0)	
			setFailAlert("Invalid File")
		}
	}


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
		console.log(data,'tusar')
			setGlobalFilter(data)
	}
	

	const { theme, toggleTheme } = useTheme();
	const { hospital, toggleHospital } = useTheme();
	
	useEffect(() => {  toggleTheme(t(headingTitle))  }, [t(headingTitle)]);

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

					{/*File upload*/}
					{showUpload == 1 &&
						<div className="flex flex-col w-full max-w-4xl">
							<FileChoose progress={progress} sendDataToParent={handleDataFromChild} textUpload={textUpload} resetComponents={resetComponents} enableUpload={handleActionFromSearch} start={start} />
							<div className="flex  justify-center mt-32">
								<Button

									disabled={!(allowUpload)}
									onClick={() => {
										let msg = ""
										let type='replace'
										if (textUpload == "Data replacement") {
											msg = "Are you sure to replace old data with new data?"
										} else { msg = "Are you sure to continue?"
										type='upload' }
										if (window.confirm(t(msg))) {
											server(type)
										}
									}}
									className="mx-8"
									variant="contained"
									color="success"
									type="submit"
								>
									{t("Upload")}
								</Button>
							</div>
						</div>
					}


					{showUpload == 0 &&
						<>{/*Table*/}
							<SearchInput textUpload={textUpload} enableUpload={handleActionFromSearch} globalFilter={handleSetGlobalFilter} txt={"Type your query and press Enter"}/>
							<Table filter={{}} sendCountToParent={handleCountDataFromChild} globalFilter={globalFilter}   tableName={tableName} keyConfig={keyConfig}/>
						</>
					}


				</div>
			}
	/>

	);
}

export default Surgery;
