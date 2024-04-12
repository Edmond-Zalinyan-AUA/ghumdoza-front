import React from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";


const LoginForm = () => {
    return (
        <div className='wrapper'>
            <form action="">
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
                    <p>Create a new account <a href="youtube.com">Register</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;