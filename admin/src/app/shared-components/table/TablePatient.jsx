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
import '../../../styles/table-html.css';

export default function TablePatient(props) {
    const { t } = useTranslation('shared-components');
    const [value, setValue] = React.useState(0);

    function part3(a,b,c,d){
      return (
          <span style={{display: "flex"}} className='dpc'> 
            <div>
              
              {a && b && <p>{a}</p>} 
              {a && b && <p>{b}</p>} 

              {a && b==null && <p className='pv10'>{a}</p>} 
            
              
            </div>  

            <div className='fxl pv5'> / </div> 
            <div className='pv10'>{c}</div> 

            {d &&
              <div  className='fxl pv5' > / </div>
            }
            {d &&
              <div className='pv10'>{d}</div>  
            }

          </span>
      )
    }

    return ( 
    <table  className='dpc dpc-table'>
        <tr>
            <th rowSpan={2} className='b0'> {props.sl} </th>
            <th>{part3('患者', 'コード', '0097726', null)}</th>
            <th>{part3('名前', null, '山田　太郎', null)}</th>
            <th>{part3('病棟', null, '33', null)}</th>
            <th>{part3('入院日', null, '8', '23')}</th>
            <th>{part3('退院', '予定日', '未', '0')}</th>
            <th>{part3('入院', '日数', '3', null)}</th>
            <th>{part3('今期', '患者数', '未', null)}</th>
            <th>{part3('過去', '患者数', '未', null)}</th>
            <th>{part3('入院', '期間Ⅱ', '16', null)}</th>
            <th>確定
            <IconButton aria-label="fingerprint" color="success"><Fingerprint/></IconButton>
            </th>
        </tr>
        <tr>
            <td colSpan={2}>0  1  0  0  6  0</td>
            <td colSpan={2}>X</td>
            <td>未</td>
            <td>9 9</td>
            <td>0</td>
            <td>4</td>
            <td>1</td>
            <td>未</td>
        </tr>
    </table>
   );
}
 