import { Icon, IconButton} from "@mui/material";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import TextField from '@mui/material/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as XLSX from "xlsx";
import { useEffect, useRef, useState } from 'react';
import '../../../styles/custom-basic.css';
import i18next from 'i18next';
import { lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import * as React from 'react';
import axios from 'axios';
import apiConfig from '../../configs/apiConfig';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import en from '../i18n/en';
import ja from '../i18n/ja';
import Box from '@mui/material/Box';

i18next.addResourceBundle('en', 'shared-components', en);
i18next.addResourceBundle('ja', 'shared-components', ja);

const defaultValues = { name: '', email: '', subject: '', message: '' };
const schema = z.object({
	name: z.string().nonempty('You must enter a name'),
	subject: z.string().nonempty('You must enter a subject'),
	message: z.string().nonempty('You must enter a message'),
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email')
});

/**
 * The help center support.
 */
function FileChoose(props) {
	const { control, handleSubmit, watch, formState } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const form = watch();

	function onSubmit(data) {
		// eslint-disable-next-line no-console
		console.log(data);
	}

	if (_.isEmpty(form)) {
		return null;
	}

 
    const { t } = useTranslation('shared-components');

    const [fName, setFName] = useState("");
    const [message, setMessage] = useState("none");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [progress, setProgress] = React.useState(10);

    useEffect(() => {  setProgress(props.progress)  }, [props.progress]);
    useEffect(() => {  console.log(99); setData([])  }, [props.resetComponents]);
    

    function LinearProgressWithLabel(props) {
      return (<Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props}/>
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>);
    }


    const readUploadFile = (e) => { e.preventDefault(); 
        try {
              setLoading(true)
              if (e.target.files) { 
                  const reader = new FileReader(); 
                  reader.onload = (e) => { 
                  const data = e.target.result; 
                  const workbook = XLSX.read(data, { type: "array" }); 
                  const sheetName = workbook.SheetNames[0]; 
                 
                  const worksheet = workbook.Sheets[sheetName];
                  const json = XLSX.utils.sheet_to_json(worksheet); 
                  setLoading(false)
                  setMessage(Object.keys(json).length+" "+t("items found!") || "none")
                   
                    setData(json)
                    props.sendDataToParent(json);

                  }; 
                  reader.readAsArrayBuffer(e.target.files[0]);
                 
            }
        }
        catch(err) {
            setMessage(t("No data found!"))
            console.log('errro',err)
            setLoading(false)
        }
      }

  return (
    <div className="">
      <div className="flex flex-col">

        <motion.span
          initial={{ x: 20 }}
          animate={{ x: 0, transition: { delay: 0.0 } }}
        >
          <div className="sm:mt-32">
            <Button
              onClick={() => {
                props.enableUpload(0)
              }}
              color="secondary"
              startIcon={<FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>}
            >
              {t(props.textUpload)}
            </Button>
          </div>
        </motion.span>

        <motion.span
          initial={{ y: -20 }}
          animate={{ y: 0, transition: { delay: 0.1 } }}
        >
          <div className="mt-32 sm:mt-48 p-24 pb-28 sm:p-40 sm:pb-28 rounded-2xl  border-2 border-dashed rounded-2xl bg-slate-100">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="px-0 sm:px-24 items-center flex flex-col items-center"
            >
              <Button disabled={loading}
                color="success" variant="contained" component="label" style={{ width: "600px", height: "400px", ...loading == true ? { opacity: ".3" } : {} }}>
                <Icon> add_to_photos </Icon>&nbsp; {t('Choose XLSX')}
                &nbsp;<input name="upload" id="upload" onChange={readUploadFile} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" type="file" />
              </Button>

              {loading == true &&
                <CircularProgress />
              }


              <Typography display={message} color="text.secondary" className=' text-center'>
                {message}
              </Typography>


              <div className="mb-24 mt-24">
                <Typography color="text.secondary" className=' text-center'>
                  {t('Drag and drop')} <br />  {t('Or refer to a local file upload')}
                </Typography>
              </div>

            </form>

            { progress > 0 &&
                  <LinearProgressWithLabel value={progress}/>
            }

          </div>
        </motion.span>

      </div>
    </div>
  );
}

export default FileChoose;
