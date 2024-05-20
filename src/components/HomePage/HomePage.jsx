import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import { CgProfile } from "react-icons/cg";
import { SiJirasoftware } from "react-icons/si";
import './HomePage.css';
import { FaTimes } from 'react-icons/fa';
import axios from "axios";


const HomePage = ({ id, firstName, lastName }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    code: '',
    creatorId: id,
    description: ''
  });

  const handleProjectHover = (project) => {
    setSelectedProject(project);
  };

  const handleProjectClick = (project) => {
    // Trigger your API call here
    console.log(`Clicked on project: ${project.name}`);
  };

  const handleCloseProjectClick = () => {
    setShowCreateProjectForm(false);
    resetCreateProjectForm();
  };

  const handleCreateProjectClick = () => {
    setShowCreateProjectForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      [name]: value
    });
  };

  const resetCreateProjectForm = () => {
    setNewProject({
      code: '',
      name: '',
      creatorId: id,
      description: ''
    });
  };

  const handleCreateProjectSubmit = (e) => {
    e.preventDefault();
    axios.put('http://localhost:8080/project/create', newProject)
      .then(response => {
        setProjects([...projects, response.data]);
        setShowCreateProjectForm(false);
        resetCreateProjectForm();
      })
      .catch(error => console.error('Error creating project:', error));
  };

  useEffect(() => {
    axios.get('http://localhost:8080/project/list/' + id)
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
                <a 
                  href="#" 
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'seagreen'}
                  onMouseLeave={(e) => !showCreateProjectForm && (e.target.style.backgroundColor = '')}
                  onClick={handleCreateProjectClick}
                  className={showCreateProjectForm ? 'create-link-active' : ''}
                >Create New Project</a>
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
          <span className="username">{firstName} {lastName}</span>
          <CgProfile className='profile-icon'/>
        </div>
      </nav>
      {showCreateProjectForm && (
        <div className="create-project-form">
          <FaTimes className="close-icon" onClick={handleCloseProjectClick} />
          <form onSubmit={handleCreateProjectSubmit}>
            <h2>Create New Project</h2>
            <div className="input-box-new-project">
              <input 
                type="text" 
                name="code" 
                placeholder="Project Code" 
                value={newProject.code} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="input-box-new-project">
              <input 
                type="text" 
                name="name" 
                placeholder="Project Name" 
                value={newProject.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="input-box-new-project">
              <input 
                type="text"
                name="description" 
                placeholder="Project Description" 
                value={newProject.description} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default HomePage;
