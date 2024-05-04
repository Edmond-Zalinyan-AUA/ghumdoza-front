import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import { CgProfile } from "react-icons/cg";
import { SiJirasoftware } from "react-icons/si";
import './HomePage.css';
import Dashboard from '../DashBoard/Dashboard.jsx';
import axios from "axios";


const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);

  const handleProjectHover = (project) => {
    setSelectedProject(project);
  };

  const handleProjectClick = (project) => {
    // Trigger your API call here
    console.log(`Clicked on project: ${project.name}`);
  };

  useEffect(() => {
    axios.get('http://localhost:8080/project/list/1')
      .then(response => {
        setProjects(response.data.projectDtos);
      })
      .catch(error => console.error('Error fetching projects:', error));
  }, []);
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
              {projects.map(project => (
                  <a 
                    key={project.code} 
                    href="#" 
                    onMouseEnter={() => handleProjectHover(project)} 
                    onMouseLeave={() => setSelectedProject(null)}
                    onClick={() => handleProjectClick(project)}
                    style={{ backgroundColor: selectedProject === project ? 'seagreen' : '' }}
                  >
                    <SiJirasoftware /> [{project.code}] {project.name}
                  </a>
                ))}
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
      {/* {<Dashboard />} */}
    </div>
  );
};

export default HomePage;