import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import BallotIcon from '@mui/icons-material/Ballot';
import PendingIcon from '@mui/icons-material/Pending';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import Fingerprint from '@mui/icons-material/Fingerprint';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../../../styles/table-html.css';
import axios from 'axios';
import apiConfig from '../../configs/apiConfig';
import { lazy } from 'react';
import Button from '@mui/material/Button';
import CIcon from '@mui/icons-material/ChevronRight';
import Edit from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';

const DPCEditModal = lazy(() => import('../modal/DPCEditModal'));

export default function TablePatient(props) {
    const { t } = useTranslation('shared-components');
    const [value, setValue] = React.useState(0);
    const [edit, setEdit] = React.useState(0);

    async function verify(id,is_verified) {
      try {
          console.log(id,is_verified)
          const result = await axios.post(apiConfig.PatientDpcVerify, {id:id, is_verified:is_verified});
          props.verify()
          
      } catch (error) {
        console.log(error)
        
      }
    }


    let data=props.data
    function part3(a,b,c,d){
      return (
          <span style={{display: "flex"}} className='dpc'> 
            <div>
              
              {a && b && <p>{a}</p>} 
              {a && b && <p>{b}</p>} 

              {a && b==null && <p className='pv10'>{a}</p>} 
            
              
            </div>  

            <div className='fxl pv5'> / </div> 
            {c==null?  <div  style={(c==null || c=='')? {color : 'red'}:{color : '未'}}  className='pv10'  >{'未'}</div> : <div style={(c==null || c=='未')? {color : 'red'}:{color : ''}}  className='pv10'>{c}</div>  }
        
            {d &&
              <div  className='fxl pv5' > / </div>
            }
            {d &&
              <div  style={d=='未'? {color : 'red'}:{color : ''}}   className='pv10'>{d}</div>  
            }

          </span>
      )
    }

    async function change(a,b,c) {
      console.log(a,b,c)
    }

    function UpdateComplete(para) {
      props.verify()
     // setIsRefetching(true)
    }

    function changeEdit() {
      if(edit==1){
        setEdit(0)
      }else{
        setEdit(1)
      }
    }

     
    
    return ( 
    <table  className={`dpc dpc-table p-10 mt-20 ${props.basic ==1 ? 'bgblanchedalmond' : ''}`} >
     
          <tr>
            <td className="b0 width_single text-right border-right-zero" colSpan={12}>

            <Button  className="mr-24" size="small" variant="contained" onClick={() => {
                if(edit==1){
                  setEdit(0)
                }else{
                  setEdit(1)
                }
            }}
              endIcon={<Edit />}>
              編集
            </Button>

          {props.basic !=1 &&   <Button  size="small" variant="contained" onClick={() => {
             localStorage.setItem("ld",data.id)
              props.patientDetails(data)
            }}
              endIcon={<CIcon />}>
              詳細
            </Button>  }

            </td>
          </tr>      

    


        <tr>
            <td className="b0 width_single text-center" rowSpan={2}> {props.sl} </td>
            <td className="width_double">{part3('患者', 'コード', data.patient_code, null)}</td>
            <td className="width_double">{part3('名前', null, data.doctor, null)}</td>
            <td className="width_single">{part3('病棟', null, data.ward, null)}</td>
            <td className="width_double">{part3('入院日', null, data.admission_date, null)}</td>
            <td className="width_double">{part3('退院', '予定日', data.discharge_date, null)}</td>
            <td className="width_single">{part3('入院', '日数', data.hospitalization_days, null)}</td>
            <td className="width_single">{part3('今期', '患者数', '未', null)}</td>
            <td className="width_single">{part3('過去', '患者数', '未', null)}</td>
            <td className="width_single">{part3('入院', '期間Ⅱ', '16', null)}</td>
            <td className="width_others">確定
              {data.is_verified==1 ?
              <IconButton aria-label="fingerprint"
              onClick={() => {
                verify(data.id,0)
              }}
              color="success"><Fingerprint/></IconButton> :  <IconButton aria-label="PendingIcon" 
              onClick={() => {
                verify(data.id,1)
              }}
              
              color="error"><PendingIcon/></IconButton> 
              }  
          
            </td>
            <td className="b0 width_single text-center border-right-zero"></td>
        </tr>
        <tr>
            <th colSpan={2} style={data.s_dpc_6 ? {color : 'red'}:{color : ''}} >{data.s_dpc_6? data.s_dpc_6 : data.dpc_6 }
 {/* <DPCEditModal data={{val:data.s_dpc_6? data.s_dpc_6 : data.dpc_6,id:data.id, options:['1','2','3']}}  api={''}  complete={UpdateComplete}/>
*/}

 



            </th>
            <th colSpan={2} style={data.s_and_1 ? {color : 'red'}:{color : ''}} >
              <div className=" ">
                {data.s_and_1? data.s_and_1 : data.and_1 }
                {edit==1 && 
                    <DPCEditModal data={{val:data.s_and_1? data.s_and_1 : data.and_1,id:data.id, key:'and_1', options:['0','1']}}  api={''}  complete={UpdateComplete}/>
                }
                
              </div>
            </th>
            <th style={data.s_age_1 ? {color : 'red'}:{color : ''}} >
              
              
              
     
          {data.s_age_1? data.s_age_1 : data.age_1 }
          {edit==1 &&  <DPCEditModal data={{val:data.s_age_1? data.s_age_1 : data.age_1,id:data.id, key:'age_1', options:['0','1']}}  api={''}  complete={UpdateComplete}/>}
  


             
           </th>
            <th style={data.s_sur_2 ? {color : 'red'}:{color : ''}} >{data.s_sur_2? data.s_sur_2 : data.sur_2 }
            {edit==1 && <DPCEditModal data={{val:data.s_sur_2? data.s_sur_2 : data.sur_2,id:data.id, key:'sur_2', options:['99','97','01','02','03','04','05','06']}}  api={''}  complete={UpdateComplete}/>}
            </th>
            <th  style={data.s_tre1_1 ? {color : 'red'}:{color : ''}}  >{data.s_tre1_1? data.s_tre1_1 : data.tre1_1 }
            {edit==1 && <DPCEditModal data={{val:data.s_tre1_1? data.s_tre1_1 : data.tre1_1,id:data.id, key:'tre1_1', options:['0','1','2','3','4','5']}}  api={''}  complete={UpdateComplete}/>}
            </th>
            <th  style={data.s_tre2_1 ? {color : 'red'}:{color : ''}} >{data.s_tre2_1? data.s_tre2_1 : data.tre2_1 }            
            {edit==1 && <DPCEditModal data={{val:data.s_tre2_1? data.s_tre2_1 : data.tre2_1,id:data.id, key:'tre2_1', options:['0','1','2','3','4','5','6','7','8','9']}}  api={''}  complete={UpdateComplete}/>}
            </th>

            <th style={data.s_sec_1 ? {color : 'red'}:{color : ''}} >{data.s_sec_1? data.s_sec_1 : data.sec_1 }
            {edit==1 && <DPCEditModal data={{val:data.s_sec_1? data.s_sec_1 : data.sec_1,id:data.id, key:'sec_1', options:['0','1','2']}}  api={''}  complete={UpdateComplete}/>}
            </th>
            
            <th  style={data.s_sco_1 ? {color : 'red'}:{color : ''}} >{data.s_sco_1? data.s_sco_1 : data.sco_1 }
            {edit==1 && <DPCEditModal data={{val:data.s_sco_1? data.s_sco_1 : data.sco_1,id:data.id, key:'sco_1', options:['0','1']}}  api={''}  complete={UpdateComplete}/>}
            </th>
            <th className="b0 width_single text-center border-right-zero"></th>
        </tr>
        <tr> <td className="b0 width_single text-right border-right-zero border-right-zero" colSpan={12}></td> </tr>
    </table>
   );
}
 