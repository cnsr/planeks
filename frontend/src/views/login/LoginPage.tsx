import React, {useState, useEffect} from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import axios from 'axios';
import './login.css'

interface LoginProps {
    callback: () => void
}

const LoginPage: React.FC<LoginProps> = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorText, setErrorText] = useState('');

    useEffect(() => {
        setErrorText('');
    }, [username, password])

    const performLogin = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        axios.post("https://planeks.tk/api/users/login/", {
            username: username,
            password: password
        }).then(response => {
            localStorage.setItem("schemaJWT", response.data.token);
            localStorage.setItem("schemaUsername", response.data.username);
            props.callback();
        }).catch(err => {
            setErrorText(err.response.data.error)
        })
    }

    return <div id='login'>
        <Form id='login-form' onSubmit={performLogin}>
            <Form.Row id='title-row'>
                <h3>Login</h3>
            </Form.Row>
            <Form.Row>
                <Form.Control
                    as='input' placeholder='Username'
                    className='wide-control'
                    onChange={e => setUsername(e.target.value)}
                />
            </Form.Row>
            <Form.Row>
                <Form.Control
                    as='input' placeholder='Password' type='password'
                    className='wide-control'
                    onChange={e => setPassword(e.target.value)}
                />
            </Form.Row>
            <Form.Row id='button-row'>
                <Button type='sumbit' disabled={!username || !password}>Login</Button>
            </Form.Row>
            <Form.Row id='error-row'>
            { errorText ? 
            <Alert variant='warning'>
                {errorText}
            </Alert> : null}
            </Form.Row>
        </Form>
    </div>
}

export default LoginPage;