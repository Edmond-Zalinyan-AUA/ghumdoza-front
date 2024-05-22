import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";




const LoginForm = ({ onLogin }) => {
    const [action, setAction] = useState('')
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    });
    const [loginData, setLoginData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        password: ''
    });
    const [isWrongCredentials, setIsWrongCredentials] = useState(false);

    const registerLink = () => {
        setAction(' active');
        setIsWrongCredentials(false);
    };

    const loginLink = () => {
        setAction('');
        setIsWrongCredentials(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        axios.put('http://localhost:8080/user/login', loginData)
            .then(response => {
                if (response.status === 200) {
                    onLogin(response.data.id, response.data.firstName, response.data.lastName);
                }
            })
            .catch(error => {
                if (error.response.status === 404 || error.response.status === 401) {
                    setIsWrongCredentials(true);
                }
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({
            ...registerData,
            [name]: value
        });
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        axios.put('http://localhost:8080/user/register', registerData)
            .then(response => {
                if (response.status === 200) {
                    onLogin(response.data.id, response.data.firstName, response.data.lastName);
                }
            })
            .catch(error => {
                if (error.response.status === 400) {
                    setIsWrongCredentials(true);
                }
            });
    };

    return (
        <div className={`wrapper${action}`}>
            <div className='form-box login'>
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type='text' name="username" placeholder='Username' value={loginData.username} onChange={handleInputChange} required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type='password' name="password" placeholder='Password' value={loginData.password} onChange={handleInputChange} required />
                        <FaLock className='icon' />
                    </div>
                    {(isWrongCredentials) &&
                        < div className="wrong-credentials-warning">
                            <p>Wrong Credentials</p>
                        </div>}
                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p>Create a new account <a href="register" onClick={registerLink}>Register</a></p>
                    </div>
                </form>
            </div >

            <div className='form-box register'>
                <form onSubmit={handleRegister}>
                    <h1>Register</h1>
                    <div className="input-box">
                        <input type='text' name="firstName" placeholder='First Name' value={registerData.firstName} onChange={handleInputChange} required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type='text' name="lastName" placeholder='Last Name' value={registerData.lastName} onChange={handleInputChange} required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type='text' name="username" placeholder='Username' value={registerData.username} onChange={handleInputChange} required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type='password' name="password" placeholder='Password' value={registerData.password} onChange={handleInputChange} required />
                        <FaLock className='icon' />
                    </div>
                    {(isWrongCredentials) &&
                        < div className="wrong-credentials-warning">
                            <p>Username Already Taken</p>
                        </div>}
                    <button type="submit">Register</button>

                    <div className="login-link">
                        <p>Already have an account <a href="login" onClick={loginLink}>Login</a></p>
                    </div>
                </form>
            </div>



        </div >
    );
};

export default LoginForm;