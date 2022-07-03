import React, {useState, useEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import axios from 'axios'
import { showErrMsg, showSuccessMsg} from './unitl/notification/notification'
import Header from './header'
import Alert from '@mui/material/Alert';

function ActivationEmail() {
    const {activation_token} = useParams();
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState('');
    const history = useHistory();

    useEffect(() => {
        if(activation_token){
            const activationEmail = async () => {
                try{
                    const res = await axios.post('http://localhost:5000/user/activation', {activation_token})
                    history.push('/');
                } catch(err){
                   
                }
            } 
            activationEmail();
        }
    },[activation_token])

    return(
        <div id="content-wrapper">
            <Header/>

            <Alert sx={{marginTop: 9}} severity="success">Xác minh tài khoản thành công</Alert>
        </div>
    )
}

export default ActivationEmail