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
        username: '',
        password: ''
    });

    const registerLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            console.log('Registering...');
            const response = await axios.get('http://localhost:8080/user/login', loginData);
            if (response.status === 200) {
                onLogin(); 
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
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
        try {
            console.log('Registering...');
            const response = await axios.put('http://localhost:8080/user/register',registerData);
            if (response.status === 200) {
                onLogin(); // Call the onLogin function when register is successful
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
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
                        <FaLock className='icon'/>
                    </div>

                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p>Create a new account <a href="#" onClick={registerLink}>Register</a></p>
                    </div>
                </form>
             </div>

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
                        <FaLock className='icon'/>
                    </div>

                    <button type="submit">Register</button>

                    <div className="login-link">
                        <p>Already have an account <a href="#" onClick={loginLink}>Login</a></p>
                    </div>
                </form>
             </div>
             
             

        </div>
    );
};

export default LoginForm;