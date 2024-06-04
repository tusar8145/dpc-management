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

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Icon, Grid,Stack } from "@mui/material";
import TextField from '@mui/material/TextField';
 
import { useAppSelector } from 'app/store/hooks';
import { selectUserRole, selectUser } from '../../auth/user/store/userSlice';



 
 
 
import Autocomplete from '@mui/material/Autocomplete';
import * as React from 'react';

 import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

 import Box1 from '@mui/material/Box';
 const Table = lazy(() => import('../../shared-components/table/IssueTable'));

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

 


 
function Issue() {
 
	let headingTitle='Contact form'
 
	const { t } = useTranslation('shared-components');

	const { theme, toggleTheme } = useTheme();
	const { hospital, toggleHospital } = useTheme();
	
	useEffect(() => {  toggleTheme(t(headingTitle))  }, [t(headingTitle)]);

	let base_url=apiConfig.base_url+'issue/'

	const user = useAppSelector(selectUser);
	console.log(user,'xuser')

	const handleSubject = (event) => {  setsubject(event.target.value); };
	const handleIssue = (event) => {  setissue(event.target.value); };
	 const handleIssueReply = (event) => {  setpostreply(event.target.value); };
  
	const [error, seterror] = useState(0);
	const [error2, seterror2] = useState(0);
	const [subject, setsubject] = useState('');
	const [issue, setissue] = useState('');
  
	const [issue_id, setissue_id] = useState(null);
  
	const [getreply, setgetreply] = useState([]);
	const [postreply, setpostreply] = useState('');
	const [issolved, setissolved] = useState(0);
  
	const postIssueReply = (event) => {
	 if(postreply==''){seterror2(1)}else{
	 
		const current = new Date();
		const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
		var this_unique=new Date().valueOf().toString();
  
		
		const master_submit = {
		  "issue_id":issue_id,
		  "user_id":user.uid,
		  "issue_user_id":user.uid,
		  "reply":postreply,
		  "created":date
		}
  
  
		const res = axios.post(base_url + "post_issue_reply", master_submit).then(async (response) => {
		  //alert('Request Submitted')
		  setpostreply('')
   
		  var firsr_page_jsonreply = {
			"issue_id":issue_id
		  } 
	  console.log(firsr_page_jsonreply,'firsr_page_jsonreply')
  
		  await axios.post(base_url + "get_issue_reply", firsr_page_jsonreply).then((res) => {
			console.log(res,'res')
			setgetreply(res.data.result)
	
			var objDiv = document.getElementById("hjk");
			objDiv.scrollTop = objDiv.scrollHeight;
		}).catch(function (error) { if (error.response) { console.log(error.response.data); } });    
  
  
  
  
		}).catch(function (error) {
		  if (error.response) {  console.log(error.response.data, 'error'); } 
		});  
  
	  } 
	  
	 };
  
  
  
	const postIssue = (event) => {
	  if(subject=='' || issue==''){seterror(1)}else{
		console.log(subject,issue,'res')
  
		const current = new Date();
		const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
		var this_unique=new Date().valueOf().toString();
  
		
		const master_submit = {
		  subject: subject,
		  issue: issue,
		  created: date,
		  creator:  user.uid,
		}
  
		const res = axios.post(base_url + "post_issue", master_submit).then((response) => {
		  alert('Request Submitted')
		  setsubject('')
		  setissue('')
		  get_issue();
		}).catch(function (error) {
		  if (error.response) {  console.log(error.response.data, 'error'); } 
		});  
  
	  }
	  
	 };
  
  
  
	 
  
   
	  const   get_issue = async (event) => {
  var iid
	  //let id = e.target.getAttribute("data-id")
  
	  //console.log(id,'get_issueget_issue')
   
	  try {
		iid = event.target.getAttribute("data-id2")
		console.log(iid,'get_issueget_issue')
	  } catch (error) {
		
	  } 
	
   
	   var firsr_page_json = {
		  ...(user.is_marchant==1? { user_id:user.uid , } : { }), 
   
		} 
	
	  
  
		await axios.post(base_url + "get_issue", firsr_page_json).then((res) => {
			  console.log(res,'res')
			  const my_json = []
			  var get_ = res.data.result;
			  for (var i=0; i < get_.length; i++) {
  
  
  var status='Pending'
  var status_date
  if(get_[i].is_solved==1){
	status='Solved'
  }
  
  else if(get_[i].is_seen==1){
	status='Seen'
  }
  
  
  
  var have_new=''
  if(get_[i].is_solved!=1){
  if(get_[i].reply=='mar_new' && user.is_marchant==1){
  have_new=' New ✉ found'
  }
  else if (get_[i].reply=='adm_new' && user.is_marchant!=1){
	have_new=' New ✉ found'
  }
  }
  
  
  
  
  
				  var x_data = {
						id: get_[i].id,
						subject: get_[i].subject, 
						issue: get_[i].issue, 
						reply: get_[i].reply, 
						have_new:have_new,
						status:status,
						is_seen: get_[i].is_seen,
						is_solved: get_[i].is_solved,
						creator_: get_[i].creator_?.name,
						...(get_[i].reply_by_? { reply_by_: get_[i].reply_by_?.name , } : {reply_by_:''}), 
						created: get_[i].created, 
						status_date: get_[i].replied, 
				  }
				  my_json.push(x_data);
				  console.log(x_data,'x_data')
			  } 
			setget_issues(my_json); 
			console.log(my_json,'my_json')
		  }).catch(function (error) { console.log(error,'res')  });    
	  };
  
  useEffect(() => {
	  get_issue();
  }, []);
  
  
  const   get_issue2 = async (event) => {
   
	 
		 var firsr_page_json = {
			...(user.is_marchant==1? { user_id:user.uid , } : { }), 
			 is_seen:0, 
			 is_solved:0, 
		  } 
	  console.log(firsr_page_json,'firsr_page_json')
		  await axios.post(base_url + "get_issue", firsr_page_json).then((res) => {
				console.log(res,'res')
				const my_json = []
				var get_ = res.data.result;
				for (var i=0; i < get_.length; i++) {
	
	
	var status='Pending'
	var status_date
	if(get_[i].is_solved==1){
	  status='Solved'
	}
	
	else if(get_[i].is_seen==1){
	  status='Seen'
	}
	
	var have_new=''
	if(get_[i].is_solved!=1){
	if(get_[i].reply=='mar_new' && user.is_marchant==1){
	have_new=' New ✉ found'
	}
	else if (get_[i].reply=='adm_new' && user.is_marchant!=1){
	  have_new=' New ✉ found'
	}
	}
  
  
  
					var x_data = {
						  id: get_[i].id,
						  subject: get_[i].subject, 
						  issue: get_[i].issue, 
						  reply: get_[i].reply, 
						  have_new:have_new,
						  status:status,
						  is_seen: get_[i].is_seen,
						  is_solved: get_[i].is_solved,
						  creator_: get_[i].creator_.name,
						  ...(get_[i].reply_by_? { reply_by_: get_[i].reply_by_.name , } : {reply_by_:''}), 
						  created: get_[i].created, 
						  status_date: get_[i].replied, 
					}
					my_json.push(x_data);
					console.log(x_data,'x_data')
				} 
			  setget_issues(my_json); 
			  console.log(my_json,'my_json')
			}).catch(function (error) { if (error.response) { console.log(error.response.data); } });    
		};
	
   
		const   get_issue3 = async (event) => {
		  var iid
			  //let id = e.target.getAttribute("data-id")
		  
			  //console.log(id,'get_issueget_issue')
		   
			  try {
				iid = event.target.getAttribute("data-id2")
				console.log(iid,'get_issueget_issue')
			  } catch (error) {
				
			  } 
		   
		   
			   var firsr_page_json = {
				  ...(user.is_marchant==1? { user_id:user.uid , } : { }), 
				  is_seen:1 , is_solved:0 , 
   
				} 
			
			  
		  
				await axios.post(base_url + "get_issue", firsr_page_json).then((res) => {
					  console.log(res,'res')
					  const my_json = []
					  var get_ = res.data.result;
					  for (var i=0; i < get_.length; i++) {
		  
		  
		  var status='Pending'
		  var status_date
		  if(get_[i].is_solved==1){
			status='Solved'
		  }
		  
		  else if(get_[i].is_seen==1){
			status='Seen'
		  }
		  
  
		  var have_new=''
		  if(get_[i].is_solved!=1){
		  if(get_[i].reply=='mar_new' && user.is_marchant==1){
		  have_new=' New ✉ found'
		  }
		  else if (get_[i].reply=='adm_new' && user.is_marchant!=1){
			have_new=' New ✉ found'
		  }
		  }
  
		  
						  var x_data = {
								id: get_[i].id,
								subject: get_[i].subject, 
								issue: get_[i].issue, 
								reply: get_[i].reply, 
								have_new:have_new,
								status:status,
								is_seen: get_[i].is_seen,
								is_solved: get_[i].is_solved,
								creator_: get_[i].creator_.name,
								...(get_[i].reply_by_? { reply_by_: get_[i].reply_by_.name , } : {reply_by_:''}), 
								created: get_[i].created, 
								status_date: get_[i].replied, 
						  }
						  my_json.push(x_data);
						  console.log(x_data,'x_datax_data')
					  } 
					setget_issues(my_json); 
					console.log(my_json,'my_json')
				  }).catch(function (error) { if (error.response) { console.log(error.response.data); } });  
				  
  
   
			  };
		  
  
   
			  const   get_issue4 = async (event) => {
				console.log( 'res')
				var iid
					//let id = e.target.getAttribute("data-id")
				
					//console.log(id,'get_issueget_issue')
				 
					try {
					  iid = event.target.getAttribute("data-id2")
					  console.log(iid,'get_issueget_issue')
					} catch (error) {
					  
					} 
				 
				 
					 var firsr_page_json = {
						...(user.is_marchant==1? { user_id:user.uid , } : { }), 
						is_seen:null ,    is_solved:1  
					  } 
				  
					
				
					  await axios.post(base_url + "get_issue", firsr_page_json).then((res) => {
							console.log(res,'res')
							const my_json = []
							var get_ = res.data.result;
							for (var i=0; i < get_.length; i++) {
				
				
				var status='Pending'
				var status_date
				if(get_[i].is_solved==1){
				  status='Solved'
				}
				
				else if(get_[i].is_seen==1){
				  status='Seen'
				}
	  
  
				var have_new=''
				if(get_[i].is_solved!=1){
				if(get_[i].reply=='mar_new' && user.is_marchant==1){
				have_new=' New ✉ found'
				}
				else if (get_[i].reply=='adm_new' && user.is_marchant!=1){
				  have_new=' New ✉ found'
				}
				}
				
								var x_data = {
									  id: get_[i].id,
									  subject: get_[i].subject, 
									  issue: get_[i].issue, 
									  reply: get_[i].reply, 
									  have_new:have_new,
									  status:status,
									  is_seen: get_[i].is_seen,
									  is_solved: get_[i].is_solved,
									  creator_: get_[i].creator_.name,
									  ...(get_[i].reply_by_? { reply_by_: get_[i].reply_by_.name , } : {reply_by_:''}), 
									  created: get_[i].created, 
									  status_date: get_[i].replied, 
								}
								my_json.push(x_data);
								console.log(x_data,'x_data')
							} 
						  setget_issues(my_json); 
						  console.log(my_json,'my_json')
						}).catch(function (error) { if (error.response) { console.log(error.response.data); } });    
					};
  
  
  
  
  const [get_issues, setget_issues] = useState([]);
  
  const [selected_rows, setselected_rows] = useState([]);
  const [servicesList, setservicesList] = useState([]);
  
  const [services_clientsList, setservices_clientsList] = useState([]);
  const [services_clientsList_filtered, setservices_clientsList_filtered] = useState([]);
  
  const services_clientsProps_sender = { options: services_clientsList_filtered, getOptionLabel: (option) => option.label,};
  
  const [services_clients_branchList, setservices_clients_branchList] = useState([]);  
  const [services_clients_branchList_sender_filtered, setservices_clients_branchList_sender_filtered] = useState([]); 
  const services_clients_branchList_sender = { options: services_clients_branchList_sender_filtered, getOptionLabel: (option) => option.label,};
  
  const [alert_def_txt, setalert_def_txt] = useState('Data Submitted Successfully!');
  const [alert_def_class, setalert_def_class] = useState('success');
  const handleClick = () =>{ setOpen(true); };
  const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setOpen(false); };
  const [open, setOpen] = React.useState(false);
  //main
  
  
  const [client_id, setclient_id] = useState(null);
  const [marchant_id, setmarchant_id] = useState(null);
  
  const [amount, setamount] = useState([]);
  const [method, setmethod] = useState([]);
  const [account, setaccount] = useState([]);
  const [replytime, setreplytime] = useState(0);
 
  const paymentList = [
	{ label: 'Bkash', value: 'Bkash' },
	{ label: 'Nagad', value: 'Nagad' },
	{ label: 'Upay', value: 'Upay' },
	{ label: 'Bank', value: 'Bank' },
  ]
  
  
  
  
   
  
  const markSeen = (event) => {
	var done=0
	if(selected_rows.length>0){
	  const current = new Date();
	  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
  
		for (var i = 0; i < selected_rows.length; i++) {
			
  
			var filter = filterItemsequal(get_issues, 'id', parseInt(selected_rows[i]));
  
				  const data1 = {
					  id: filter[0].id,
					  is_seen:1,
					  is_solved:0,
					  reply_by:user.uid,
					  replied:date,
					  is_delete:0,
				  }
  
				  console.log(data1, 'data1');
				  console.log(data1,'data1')
				  const res = axios.post(base_url + "update_issues", data1).then((response) => {
					  console.log(response.data, 'res');
					  done=1
					  get_issue();
				  }).catch(function (error) {
					  if (error.response) { 
						  done=0
						  console.log(done, 'done');
					  }
				  }); 
		} 
   
	}else{
	  alert('Nothing Selected')
	setalert_def_txt('Nothing Selected')
	setalert_def_class('warning')
	handleClick()
	}
  };
  
  const markSolved= (event) => {
	var done=0
	if(selected_rows.length>0){
	  const current = new Date();
	  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
  
		for (var i = 0; i < selected_rows.length; i++) {
			
  
			var filter = filterItemsequal(get_issues, 'id', parseInt(selected_rows[i]));
  
				  const data1 = {
					  id: filter[0].id,
					  is_seen:1,
					  is_solved:1,
					  reply_by:user.uid,
					  replied:date,
				  }
  
				  console.log(data1, 'data1');
				  console.log(data1,'data1')
				  const res = axios.post(base_url + "update_issues", data1).then((response) => {
					  console.log(response.data, 'res');
					  done=1
					  get_issue();
				  }).catch(function (error) {
					  if (error.response) { 
						  done=0
						  console.log(done, 'done');
					  }
				  }); 
		} 
   
	}else{
	  alert('Nothing Selected')
	setalert_def_txt('Nothing Selected')
	setalert_def_class('warning')
	handleClick()
	}
  };
  
  const markDelete= (event) => {
	var done=0
	if(selected_rows.length>0){
	  const current = new Date();
	  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
  
		for (var i = 0; i < selected_rows.length; i++) {
			
  
			var filter = filterItemsequal(get_issues, 'id', parseInt(selected_rows[i]));
			  if(filter[0].status=='Pending'){
								const data1 = {
								  id: filter[0].id,
								  is_delete:1,
							  }
							  const res = axios.post(base_url + "update_issues", data1).then((response) => {
								  console.log(response.data, 'res');
								  done=1
								  get_issue();
							  }).catch(function (error) {
								  if (error.response) { 
									  done=0
									  console.log(done, 'done');
								  }
							  });
			  }else{
				alert('ID : ' + filter[0].id + ' Not Deleted. Only issue with pending status can be deleted')
			  }
   
		} 
   
	}else{
	  alert('Nothing Selected')
	setalert_def_txt('Nothing Selected')
	setalert_def_class('warning')
	handleClick()
	}
  };
  

  
 
  const idSend = async (data) => {

	console.log(data,'data')
	setissue_id(data)

	var firsr_page_jsonreply = {
		"issue_id":data
	  } 

	await axios.post(base_url + "get_issue_reply", firsr_page_jsonreply).then((res) => {
		setreplytime(1)
		setgetreply(res.data.result)
		var objDiv = document.getElementById("hjk");
		objDiv.scrollTop = objDiv.scrollHeight;
	}).catch(function (error) { if (error.response) { console.log(error.response.data); } });  



  }


	return (
		<Root
			header={
				<div className="p-24 hidden-on-large">
					<h4>{t(headingTitle)} </h4>
				</div>
			}
			
			content={
				<div className=" p-24 sm:p-40 container">
					{/*successAlert != null && <Alert severity="success">{t(successAlert)}.</Alert>}
					{failAlert != null && <Alert severity="error">{t(failAlert)}..</Alert>}
					{failAlert != null && <ReportModal data={fail_count_list} />*/}

					<div class="grid md:grid-cols-3 xs:grid-cols-2 gap-4 mb-20" >
						<div class="col-span-1  ...">

						{replytime==0 && <div class="grid md:grid-cols-1 xs:grid-cols-1 gap-4 mt-96 mb-64" >

						<TextField type="text" name="subject" id="standard-basic" value={subject} onChange={handleSubject} label="Write Subject*" />
                    	{subject=='' && error==1 && <p style={{color:"red",marginTop: "-1%",marginBottom: "4%"}}>"Write  Subject" field is required *</p> }
                    

						<TextField type="text"
						multiline
						className='mt-20'
						rows={5}
						maxRows={8}
						name="issue" id="standard-basic" value={issue} onChange={handleIssue} label="Write Issue*" />
						{issue=='' && error==1 && <p style={{color:"red",marginTop: "-1%",marginBottom: "4%"}}>"Write Issue" field is required *</p> }
                   
				   
						<div className='mt-20'>{getreply.length==0 &&
							<Button color="primary"   data-id={1} onClick={postIssue} variant="contained" style={{marginTop:"3px"}}> <Icon>check</Icon> <span sx={{ pl: 1, textTransform: "capitalize" }}>Submit New Issue</span>  </Button>  
						}
						</div>



						</div>}


							<div class="grid md:grid-cols-1 xs:grid-cols-1 gap-4 mt-96 mb-64" >
							<div class="col-span-1  ...">
 

								{getreply.length > 0 &&
									<div id={"hjk"}
										style={{

											height: "420px",
											overflowY: "scroll",
											padding: "5px",
											border: "2px solid lightskyblue",
											borderRadius: "5px",

										}}
									>
										{getreply.map(item => (
											<>
												<Card sx={{ minWidth: 275 }}>
													<CardContent>
														<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>

															<x style={{
																fontWeight: "bold",
																color: "black"
															}}>
																{item.user_.name.toString()}
															</x>

															<p style={{ textAlign: "right", marginTop: "-20px" }}><i>{'Date:'} {item.created}</i> </p>
														</Typography>

														<Typography variant="body2">
															{item.reply.toString()}
														</Typography>
													</CardContent>
												</Card><br></br>
											</>
										))}
									</div>

								}
								<br></br>


									{issolved != "Solved" && issue_id > 0 &&
										<TextField type="text"
										fullWidth
											multiline
											rows={4}
											maxRows={8}
											name="issue" id="standard-basic2" value={postreply} onChange={handleIssueReply} label="Write Issue Reply*" />
									}
									{issolved != "Solved" && issue_id > 0 &&

										<>{postreply == '' && error2 == 1 && <p style={{ color: "red", marginTop: "-1%", marginBottom: "4%" }}>"Write Issue" field is required *</p>}</>
									}
										<br></br>
									{issolved != "Solved" && issue_id > 0 &&
										<Button className="mt-10" color="primary" data-id={1} onClick={postIssueReply} variant="contained" style={{ marginTop: "3px" }}> <Icon>check</Icon> <span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</span>  </Button>

									}



							</div>
							</div>




						</div>
						<div class="col-span-2 ml-20 ...">
						<div class="p-20 ...">
                        <Button color="primary" data-id2={1} onClick={get_issue} variant="contained" style={{marginTop:"3px"}}> <Icon>remove_red_eye</Icon> <span sx={{ pl: 1, textTransform: "capitalize" }}>View All</span></Button>
                        &nbsp;&nbsp;
                        <Button color="primary" data-id2={2} onClick={get_issue2} variant="contained" style={{marginTop:"3px"}}> <Icon>remove_red_eye</Icon> <span sx={{ pl: 1, textTransform: "capitalize" }}>View Pending</span></Button>  
                        &nbsp;&nbsp;
                        <Button color="primary" data-id2={3} onClick={get_issue3} variant="contained" style={{marginTop:"3px"}}> <Icon>remove_red_eye</Icon> <span sx={{ pl: 1, textTransform: "capitalize" }}>View Seen</span></Button>  
                        &nbsp;&nbsp;
                        <Button color="primary" data-id2={4} onClick={get_issue4} variant="contained" style={{marginTop:"3px"}}> <Icon>remove_red_eye</Icon> <span sx={{ pl: 1, textTransform: "capitalize" }}>View Solved</span></Button>  
						&nbsp;&nbsp;
						<Icon style={{cursor:"pointer", float: "right"}} onClick={get_issue}>refresh</Icon> 
						</div>

						<Table idSend={idSend} data={get_issues}/>
						</div>
					</div>



					<Grid container spacing={2} style={{paddingRight:"15px"}}>
      <Grid xs={5} style={{padding:"5px", paddingRight:"15px"}}>







 






                 </Grid>









      <Grid xs={7}>


                     
 


                    {(user.is_issue==1 && user.is_marchant!=1 ) &&
                    <>
                        <Button color="primary" data-id={1} onClick={markSeen} variant="contained" style={{marginTop:"3px"}}> <Icon>check</Icon> <span sx={{ pl: 1, textTransform: "capitalize" }}>Mark as Seen</span></Button>
                        &nbsp;&nbsp;
                        <Button color="primary" data-id={1} onClick={markSolved} variant="contained" style={{marginTop:"3px"}}> <Icon>check</Icon> <span sx={{ pl: 1, textTransform: "capitalize" }}>Mark as Solved</span></Button>  
  
                    </>
                    } 

                    {user.is_marchant==1 &&
                    <>
                         <Button color="secondary" data-id={1} onClick={markDelete} variant="contained" style={{marginTop:"3px"}}> <Icon>delete</Icon> <span sx={{ pl: 1, textTransform: "capitalize" }}>Delete</span></Button>  
 
                    </>
                    }                      

      </Grid>
</Grid>







				</div>
			}
	/>

	);
}

export default Issue;
