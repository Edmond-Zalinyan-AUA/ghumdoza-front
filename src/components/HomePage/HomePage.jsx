import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import { CgProfile } from "react-icons/cg";
import { SiJirasoftware } from "react-icons/si";
import { GrTasks } from "react-icons/gr";
import './HomePage.css';
import { FaTimes } from 'react-icons/fa';
import axios from "axios";
import ProjectTicketsGrid from '../ProjectTicketsGrid/ProjectTicketsGrid'
import TicketPage from '../TicketPage/TicketPage';


const HomePage = ({ id, firstName, lastName, onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectedProjectTasks, setSelectedProjectTasks] = useState([]);
  const [projectOnTheGrid, setProjectOnTheGrid] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [selectedTask, setSelectedTask] = useState([]);

  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false);
  const [showCreateTicketForm, setShowCreateTicketForm] = useState(false);
  const [showProjectTicketGrid, setShowProjectTicketGrid] = useState(false);
  const [showTicketPage, setShowTicketPage] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState();

  const [newProject, setNewProject] = useState({
    name: '',
    code: '',
    creatorId: id,
    description: ''
  });

  const [newTicket, setNewTicket] = useState({
    headline: '',
    body: '',
    projectCode: '',
    creatorId: id,
    assigneeId: '',
    status: ''
  });

  useEffect(() => {
    setTasks(tasks);
  }, [tasks]);

  const handleProjectHover = (project) => {
    setSelectedProject(project);
  };

  const handleTaskHover = (task) => {
    setSelectedTask(task);
  };

  const handleProjectClick = (e, project) => {
    e.preventDefault()
    axios.get('http://localhost:8080/ticket/list/project/' + project.projectId)
      .then(response => {
        setSelectedProjectTasks(response.data.ticketDtos);
        setProjectOnTheGrid(project);
        setSelectedProject(project);
        setShowProjectTicketGrid(true);
        setShowTicketPage(false);
      })
      .catch(error => console.error('Error fetching Tickets of the Project:', error));

  };

  const handleTaskClick = async (task) => {
    await axios.get('http://localhost:8080/ticket/' + task.ticketId)
      .then(response => {
        setSelectedTicket(response.data);
      })
      .catch(error => console.error('Error fetching Ticket:', error));
    setShowProjectTicketGrid(false);
    setShowTicketPage(true);
  };

  const handleCloseClick = (formType) => {
    if (formType === 'project') {
      setShowCreateProjectForm(false);
      resetCreateProjectForm();
    } else if (formType === 'ticket') {
      setShowCreateTicketForm(false);
      resetCreateTicketForm();
    }
  };

  const handleCreateProjectClick = () => {
    setShowCreateProjectForm(true);
  };

  const handleCreateTicketClick = () => {
    setShowCreateTicketForm(true);
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'project') {
      setNewProject({
        ...newProject,
        [name]: value
      });
    } else if (formType === 'ticket') {
      setNewTicket({
        ...newTicket,
        [name]: value
      });
    }
  };

  const resetCreateProjectForm = () => {
    setNewProject({
      code: '',
      name: '',
      creatorId: id,
      description: ''
    });
  };

  const resetCreateTicketForm = () => {
    setNewTicket({
      headline: '',
      body: '',
      projectCode: '',
      creatorId: id,
      assigneeId: '',
      status: ''
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

  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/ticket/create', newTicket)
      .then(response => {
        setTasks([...tasks, response.data]);
        if (response.data.projectId == projectOnTheGrid.projectId) {
          setSelectedProjectTasks([...selectedProjectTasks, response.data]);
        }
        setShowCreateTicketForm(false);
        resetCreateTicketForm();
      })
      .catch(error => console.error('Error creating ticket:', error));
  };

  useEffect(() => {
    axios.get('http://localhost:8080/project/list/' + id)
      .then(response => {
        setProjects(response.data.projectDtos);
      })
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/ticket/list/' + id)
      .then(response => {
        setTasks(response.data.ticketDtos);
      })
      .catch(error => console.error('Error fetching tickets:', error));
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
                    onClick={(e) => handleProjectClick(e, project)}
                    style={{ backgroundColor: selectedProject === project ? 'seagreen' : '' }}
                  >
                    <SiJirasoftware /> [{project.code}] {project.name}
                  </a>
                ))}
                <hr />
                <a
                  href="#"
                  onMouseLeave={(e) => !showCreateProjectForm && (e.target.style.backgroundColor = '')}
                  onClick={handleCreateProjectClick}
                  className={showCreateProjectForm ? 'create-link-active' : ''}
                >Create New Project</a>
              </div>
            </li>
            <li className="dropdown">
              <a>Tasks</a>
              <div className="dropdown-content">
                {tasks.map(task => (
                  <a
                    key={task.headline}
                    href="#"
                    onMouseEnter={() => handleTaskHover(task)}
                    onMouseLeave={() => setSelectedTask(null)}
                    onClick={() => handleTaskClick(task)}
                    style={{ backgroundColor: selectedTask === task ? 'seagreen' : '' }}
                  >
                    <GrTasks /> {task.headline}
                  </a>
                ))}
                <hr />
                <a
                  href="#"
                  onMouseLeave={(e) => !showCreateTicketForm && (e.target.style.backgroundColor = '')}
                  onClick={handleCreateTicketClick}
                  className={showCreateTicketForm ? 'create-ticket-link-active' : ''}
                >Create New Task</a>
              </div>
            </li>
          </ul>
        </div>
        <div className="user-info">
          <span className="username">{firstName} {lastName}</span>
          <CgProfile className='profile-icon' />
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      </nav>
      {showCreateProjectForm && (
        <div className="create-project-form">
          <FaTimes className="close-icon" onClick={() => handleCloseClick('project')} />
          <form onSubmit={handleCreateProjectSubmit}>
            <h2>Create New Project</h2>
            <div className="input-box-new-project">
              <input
                type="text"
                name="code"
                placeholder="Project Code"
                value={newProject.code}
                onChange={(e) => handleInputChange(e, 'project')}
                required
              />
            </div>
            <div className="input-box-new-project">
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={newProject.name}
                onChange={(e) => handleInputChange(e, 'project')}
                required
              />
            </div>
            <div className="input-box-new-project">
              <input
                type="text"
                name="description"
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) => handleInputChange(e, 'project')}
                required
              />
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      )}
      {showCreateTicketForm && (
        <div className="create-ticket-form">
          <FaTimes className="close-icon" onClick={() => handleCloseClick('ticket')} />
          <form onSubmit={handleCreateTicketSubmit}>
            <h2>Create New Ticket</h2>
            <div className="input-box-new-ticket">
              <input
                type="text"
                name="headline"
                placeholder="Ticket Headline"
                value={newTicket.headline}
                onChange={(e) => handleInputChange(e, 'ticket')}
                required
              />
            </div>
            <div className="input-box-new-ticket">
              <textarea
                name="body"
                placeholder="Ticket Body"
                value={newTicket.body}
                onChange={(e) => handleInputChange(e, 'ticket')}
                required
              />
            </div>
            <div className="input-box-new-ticket">
              <select
                name="projectCode"
                value={newTicket.projectCode}
                onChange={(e) => handleInputChange(e, 'ticket')}
                required
              >
                <option value="" disabled>Select Project</option>
                {projects.map(project => (
                  <option key={project.code} value={project.code}>
                    [{project.code}] {project.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      )}
      {showProjectTicketGrid && <ProjectTicketsGrid
        userId={id}
        project={projectOnTheGrid}
        tickets={selectedProjectTasks}
        setTickets={setSelectedProjectTasks}
        userAlltasks={tasks}
        setTicketsInMenu={setTasks}
      />} {/* Display Grid component if a project is selected */}
      {showTicketPage && <TicketPage
        userId={id}
        ticket={selectedTicket}
        setTicket={setSelectedTicket}
        userAlltasks={tasks}
        setTicketsInMenu={setTasks}
      />}{/* Display Ticket page if a ticket is selected */}

    </div>
  );
};

export default HomePage;
