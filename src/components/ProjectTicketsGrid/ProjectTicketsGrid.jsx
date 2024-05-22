import React, { useState, useEffect } from 'react';
import './ProjectTicketsGrid.css';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";

const ProjectTicketsGrid = ({ project, tickets, userAlltasks, setTicketsInMenu }) => {

    const [ticketsInGrid, setTicketsInGrid] = useState(tickets);
    const [participants, setParticipants] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [editableTicketId, setEditableTicketId] = useState("");
    const [editableTicketData, setEditableTicketData] = useState({});
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setTicketsInGrid(tickets);
    }, [tickets]);

    useEffect(() => {
        setParticipants(participants);
    }, [participants]);

    useEffect(() => {
        const fetchUserInfo = async (assigneeId) => {
            try {
                const response = await axios.get(`http://localhost:8080/user/${assigneeId}`);
                return response.data;
            } catch (error) {
                console.error(`Error fetching user info for ID ${assigneeId}:`, error);
                return null;
            }
        };

        const fetchAllUserInfos = async () => {
            const userInfoPromises = ticketsInGrid.map(ticket => fetchUserInfo(ticket.assigneeId));
            const userInfos = await Promise.all(userInfoPromises);

            const newUserMap = ticketsInGrid.reduce((acc, ticket, index) => {
                acc[ticket.assigneeId] = userInfos[index];
                return acc;
            }, {});

            setUserMap(newUserMap);
        };

        fetchAllUserInfos();
    }, [ticketsInGrid]);

    const handleEditClick = (ticketId) => {
        const ticketToEdit = ticketsInGrid.find(ticket => ticket.ticketId === ticketId);
        setEditableTicketId(ticketId);
        setEditableTicketData({
            ticketId: ticketToEdit.ticketId,
            status: ticketToEdit.status,
            body: ticketToEdit.body,
            assigneeId: ticketToEdit.assigneeId
        });
    };

    const handleSaveClick = (ticketId) => {
        // Handle save functionality here
        console.log('Saving ticket:', editableTicketData);
        axios.post('http://localhost:8080/ticket/update', editableTicketData)
            .then(response => {
                if (response.status === 200) {
                    const updatedTickets = ticketsInGrid.filter(ticket => ticket.ticketId !== ticketId);
                    setTicketsInGrid([...updatedTickets, response.data]);
                }
            })
            .catch(error => console.error('Error editing ticket:', error));

        // Reset the editable state
        setEditableTicketId(null);
        setEditableTicketData({});
        setShowSearchForm(false);
        setSearchQuery(null);
    };

    const handleDeleteClick = (ticketId) => {
        axios.delete('http://localhost:8080/ticket/delete/' + ticketId)
            .then(response => {
                if (response.data === true) {
                    const updatedTickets = ticketsInGrid.filter(ticket => ticket.ticketId !== ticketId);
                    setTicketsInGrid(updatedTickets);
                    setTicketsInMenu(userAlltasks.filter(ticket => ticket.ticketId !== ticketId))
                }
            })
            .catch(error => console.error('Error creating ticket:', error));
    };

    const handleInputChange = (field, value) => {
        setEditableTicketData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleSearchClick = () => {
        if (showSearchForm === true) {
            setShowSearchForm(false);
            setSearchQuery(null);
        } else {
            setShowSearchForm(true);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Searching for user:", searchQuery);
        // Integrate with the findbyusername API here
    };

    useEffect(() => {
        console.log(project);
        axios.get('http://localhost:8080/project/participants/' + project.projectId)
            .then(response => {
                setParticipants(response.data);
            })
            .catch(error => console.error('Error fetching tickets:', error));
    }, [project]);

    return (
        <div>
            <div className="project-headline">
                <h1>{'[' + project.code + '] - ' + project.name}</h1>
                <br />
                <div className="participant-grid">
                </div>
            </div>
            <div className="ticket-container">
                <h2>Tickets</h2>
                <br />
                <div className="ticket-grid">
                    {ticketsInGrid.map((ticket, index) => (
                        <div key={index} className="ticket-card">
                            {editableTicketId === ticket.ticketId ? (
                                <>
                                    <h3>{ticket.headline}</h3>
                                    <select
                                        name="assignee"
                                        value={editableTicketData.assigneeId}
                                        onChange={(e) => handleInputChange('assigneeId', e.target.value,)}
                                        required
                                    >
                                        <option value="" disabled>Select assignee</option>
                                        {participants.map(participant => (
                                            <option value={participant.user.id}>
                                                {participant.user.firstName} {participant.user.lastName}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={editableTicketData.status}
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                    >
                                        <option value="TO_DO">TO_DO</option>
                                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                                        <option value="DONE">DONE</option>
                                    </select>
                                    <textarea
                                        value={editableTicketData.body}
                                        onChange={(e) => handleInputChange('body', e.target.value)}
                                    />
                                </>
                            ) : (
                                <>
                                    <h3>{ticket.headline}</h3>
                                    <p><strong>Assignee:</strong> {userMap[ticket.assigneeId]?.firstName} {userMap[ticket.assigneeId]?.lastName}</p>
                                    <p><strong>Status:</strong> {ticket.status}</p>
                                    <p><strong>Body:</strong> {ticket.body}</p>
                                </>
                            )}
                            <button className="edit-button" onClick={() => editableTicketId === ticket.ticketId ? handleSaveClick(ticket.ticketId) : handleEditClick(ticket.ticketId)}>
                                {editableTicketId === ticket.ticketId ? 'Save' : 'Edit'}
                            </button>
                            <button className="delete-button" onClick={() => handleDeleteClick(ticket.ticketId)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="participant-container">
                <h2>Participants</h2>
                <br />
                {showSearchForm && (
                    <form onSubmit={handleSearchSubmit} className="search-form">
                        <input
                            type="text"
                            placeholder="Search by username to add"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                )}
                <br />
                <div className="participant-grid">
                    {participants.map((participant, index) => (
                        <div key={index} className="participant-card">
                            {(
                                <>
                                    <h3>{participant.user.firstName}</h3>
                                    <h3>{participant.user.lastName}</h3>
                                    <br />
                                    <p><strong>Role:</strong> {participant.role}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default ProjectTicketsGrid;
