import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import   { useRef } from 'react';
import apiConfig from '../../configs/apiConfig';
import axios from 'axios';
import FileUpload from '../file-upload/FileUpload'; 
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import en from '../i18n/en';
import ja from '../i18n/ja';
 
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import PendingIcon from '@mui/icons-material/Check';
 

i18next.addResourceBundle('en', 'shared-components', en);
i18next.addResourceBundle('ja', 'shared-components', ja);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


export default function DPCEditModal(props) {
    const [open, setOpen] = React.useState(false);
    const [id, setId] = React.useState(props.id);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    console.log(props.data.id,'iiiiiii')
    
    function UploadComplete(para) {
      props.complete(true)
      handleClose()
    }

    const { t } = useTranslation('shared-components');



    async function update(id,key,value) {
      try {

          const result = await axios.post(apiConfig.PatientDpcUpdate, {id:id, key:key, value:value});
          props.complete()
          handleClose()
          
      } catch (error) {
        console.log(error)
        
      }
    }
    
    const [newval, setnewval] = useState('');
    function keyup(event) {
      setnewval(event.target.value)
    }

    
    async function update_step() {
        update(props.data.id,'dpc_6',newval) 
    }
    return (<div>
 
       <IconButton aria-label="PendingIcon"  onClick={handleOpen} color="error"><ArrowDropDownIcon/></IconButton>


      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>

          <div className="w-full mt-16 sm:col-span-3">
						<Typography className="text-2xl font-semibold tracking-tight leading-6 text-center">
            {t('Change')} /  {props.data.val}
						</Typography>
						<Typography
							className="font-medium tracking-tight mt-10"
							color="text.secondary"
						>
						 <i>{props.val}</i>
						</Typography>
					</div>

          {props.data.options[0]=='999999'?
          <div className='grid grid-cols-3  items-center'>
          <TextField  id="standard-basic" label="変化" className="ml-10 col-span-2" style={{ width: '80%' }} onChange={keyup} value={newval} variant="standard" />
          
          <Button disabled={newval.length!=6}  aria-label="PendingIcon" 
              onClick={() => {
                update_step() 
              }}
              
              color="success">保存</Button> 
          </div>
          :
          <Typography className="text-2xl font-semibold tracking-tight leading-6 text-center mt-24">

              {props.data.options?.map(single => (

                <Button variant="contained" disabled={single.toUpperCase()==props.data.val} className='m-4' onClick={() => {
                  update(props.data.id,props.data.key,single.toUpperCase()) 
                }} color="success">
                  {single.toUpperCase()}
                </Button>

              ))}

        </Typography>          
          }
 



          <Typography id="modal-modal-description" className='text-center' sx={{ mt: 2 }}>
            
          </Typography>
        </Box>
      </Modal>
    </div>);
}