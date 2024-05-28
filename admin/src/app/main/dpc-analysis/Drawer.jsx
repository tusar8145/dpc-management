import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FilterList from '@mui/icons-material/FilterList';
import Input from '@mui/material/Input';
import { useEffect, useState } from 'react';

export default function TemporaryDrawer(props) {

    const [newval, setnewval] = useState('');

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' &&
            (event.key === 'Tab' ||
                event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };
    const list = (anchor) => (<Box sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }} role="presentation" onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (<ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text}/>
            </ListItemButton>
          </ListItem>))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (<ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text}/>
            </ListItemButton>
          </ListItem>))}
      </List>
    </Box>);

function handleChange(event) {
   // if(event.target.value){
        props.keyup(event.target.value)
    //}  
    setnewval(event.target.value)
  //
}


    return (<div>
     <React.Fragment key={'top'}>
            <IconButton aria-label="fingerprint"
             onClick={toggleDrawer('top', true)}
            color="success"><FilterList/></IconButton>

         
          <Drawer anchor={'top'} open={state['top']} onClose={toggleDrawer('top', false)}>
            
 
           <Typography className='m-20 p-24 text-center item-center' >
                患者コードでフィルタリング :
                    <Input
                        className={'flex flex-1 mx-8  '}
                        name="content"
                        value={newval}
                        style={{width:'350px', marginLeft:'40%'}}

                        onChange={handleChange}	 
                    />
           
           </Typography>    
 



          </Drawer>
        </React.Fragment> 
    </div>);
}