import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import BallotIcon from '@mui/icons-material/Ballot';
import PendingIcon from '@mui/icons-material/Pending';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useTranslation } from 'react-i18next';

export default function ButtonThree() {
    const { t } = useTranslation('shared-components');
    const [value, setValue] = React.useState(0);
    return (<Box sx={{ width: 500 }}>
      <BottomNavigation showLabels value={value} onChange={(event, newValue) => {
            setValue(newValue);
        }}>
        <BottomNavigationAction label="All (10)" icon={<BallotIcon />}/>
        <BottomNavigationAction label="Already checked (5)" icon={<DoneAllIcon />}/>
        <BottomNavigationAction label="Not inspected (5)" icon={<PendingIcon />}/>
      </BottomNavigation>
    </Box>);
}


{/*
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

export default function ButtonThree() {
    const { t } = useTranslation('shared-components');
 
    return ( 
<div class="flex justify-between ..." style={{"justify-content":"space-between"}}>
  <div><Button color="secondary"  variant="outlined">{t('All')}</Button></div>
  <div><Button color="success" variant="contained"> {t('Already checked')} </Button></div>
  <div><Button color="secondary" variant="outlined"> {t('Not inspected')} </Button></div>
</div>



      
      
      
   );
 

 /*<div class="flex justify-between ...">
  <div class="py-4"><Button color="secondary">{t('All')}</Button> </div>
  <div class="py-12"><Button color="success" variant="contained"> {t('Already checked')} </Button> </div>
  <div class="py-8"><Button color="secondary" variant="outlined"> {t('Not inspected')} </Button> </div>
</div>*/}