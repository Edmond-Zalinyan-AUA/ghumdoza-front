import React from 'react';
import logo from './logo.png';
import { CgProfile } from "react-icons/cg";
import './HomePage.css';
import Dashboard from '../DashBoard/Dashboard.jsx';




const HomePage = () => {
  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Project Logo" />
        </div>
        <div className="nav-links">
          <ul>
            <li className="dropdown">
              <a>Projects</a>
              <div className="dropdown-content">
                <a href="#">Project 1</a>
                <a href="#">Project 2</a>
                <a href="#">Project 3</a>
                <hr />
                <a href="#">Create New Project</a>
              </div>
            </li>
            <li className="dropdown">
              <a>Tasks</a>
              <div className="dropdown-content">
                <a href="#">Project 1</a>
                <a href="#">Project 2</a>
                <a href="#">Project 3</a>
              </div>
            </li>
            <li className="dropdown">
              <a>Teams</a>
              <div className="dropdown-content">
                <a href="#">Project 1</a>
                <a href="#">Project 2</a>
                <a href="#">Project 3</a>
              </div>
            </li>
          </ul>
        </div>
        <div className="user-info">
          <span className="username">Andranik Dodoyan</span>
          <CgProfile className='profile-icon'/>
        </div>
      </nav>
      {<Dashboard />}
    </div>
  );
};

export default HomePage;
