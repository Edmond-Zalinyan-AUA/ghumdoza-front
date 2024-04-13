import React, { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";


const LoginForm = ({ onLogin }) => {

    const [action, setAction] = useState('')

    const registerLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        onLogin(); // Call the onLogin function when login button is clicked
    };

    return (
        <div className={`wrapper${action}`}>
            <div className='form-box login'>
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type='text' placeholder='Username' required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type='password' placeholder='Password' required />
                        <FaLock className='icon'/>
                    </div>

                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p>Create a new account <a href="#" onClick={registerLink}>Register</a></p>
                    </div>
                </form>
             </div>

             <div className='form-box register'>
                <form action="">
                    <h1>Register</h1>
                    <div className="input-box">
                        <input type='text' placeholder='Username' required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type='text' placeholder='Email' required />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input type='password' placeholder='Password' required />
                        <FaEnvelope className='icon'/>
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