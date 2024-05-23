import React, { useState, useEffect } from 'react';
import './ProjectTicketsGrid.css';
import axios from 'axios';

const ProjectTicketsGrid = ({ userId, project, tickets, setTickets, userAlltasks, setTicketsInMenu,
    showProjectGrid,
    setShowProjectTicketGrid,
    showTicketPage,
    setShowTicketPage,
    // selectedTicket,
    setSelectedTicket,
    handleTaskClick
}) => {

    const [participants, setParticipants] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [editableTicketId, setEditableTicketId] = useState("");
    const [editableTicketData, setEditableTicketData] = useState({});
    const [newParticipantData, setNewParticipantData] = useState({
        username: '',
        projectId: '',
        role: ''
    });
    const [participantRemoveRequest, setParticipantRemoveRequest] = useState({
        userId: '',
        projectId: '',
    });
    const [isNewParticipantFound, setIsNewParticipantFound] = useState(true);
    const [isNewParticipantRoleSelected, setIsNewParticipantRoleSelected] = useState(true);
    const [participantDeletionAllowed, setParticipantDeletionAllowed] = useState(true);
    const TruncatedText = ({ text, maxLength }) => {
        return <p className="truncated-text">{text.length > maxLength ? text.slice(0, maxLength) + '...' : text}</p>;
    };

    useEffect(() => {
        setTickets(tickets);
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
            const userInfoPromises = tickets.map(ticket => fetchUserInfo(ticket.assigneeId));
            const userInfos = await Promise.all(userInfoPromises);

            const newUserMap = tickets.reduce((acc, ticket, index) => {
                acc[ticket.assigneeId] = userInfos[index];
                return acc;
            }, {});

            setUserMap(newUserMap);
        };

        fetchAllUserInfos();
    }, [tickets]);

    const handleEditClick = (event, ticketId) => {
        event.stopPropagation();
        const ticketToEdit = tickets.find(ticket => ticket.ticketId === ticketId);
        setEditableTicketId(ticketId);
        setEditableTicketData({
            ticketId: ticketToEdit.ticketId,
            status: ticketToEdit.status,
            body: ticketToEdit.body,
            assigneeId: ticketToEdit.assigneeId
        });
    };

    const handleSaveClick = (event, ticketId) => {
        event.stopPropagation();
        // Handle save functionality here
        // console.log('Saving ticket:', editableTicketData);
        axios.post('http://localhost:8080/ticket/update', editableTicketData)
            .then(response => {
                if (response.status === 200) {
                    const updatedTickets = tickets.filter(ticket => ticket.ticketId !== ticketId);
                    setTickets([...updatedTickets, response.data]);
                    const updatedTicket = [...userAlltasks].filter(t => t.ticketId == response.data.ticketId);
                    if (updatedTicket.length != 0 && response.data.assigneeId != userId) {
                        setTicketsInMenu([...userAlltasks].filter(t => t.ticketId !== response.data.ticketId));
                    }
                    if (updatedTicket.length == 0 && response.data.assigneeId === userId) {
                        setTicketsInMenu([...userAlltasks, response.data]);
                    }
                }
            })
            .catch(error => console.error('Error editing ticket:', error));

        // Reset the editable state
        setEditableTicketId(null);
        setEditableTicketData({});
    };

    const handleDeleteClick = (event, ticketId) => {
        event.stopPropagation();
        axios.delete('http://localhost:8080/ticket/delete/' + ticketId)
            .then(response => {
                if (response.data === true) {
                    const updatedTickets = tickets.filter(ticket => ticket.ticketId !== ticketId);
                    setTickets(updatedTickets);
                    setTicketsInMenu(userAlltasks.filter(ticket => ticket.ticketId !== ticketId))
                }
            })
            .catch(error => console.error('Error creating ticket:', error));
    };

    const handleParticipantRemoveClick = (participantId) => {
        participantRemoveRequest.projectId = project.projectId;
        participantRemoveRequest.userId = participantId;
        axios.delete('http://localhost:8080/project/participants/remove', {
            data: participantRemoveRequest
        }).then(response => {
            setParticipants(response.data)
            setIsNewParticipantFound(true);
            setIsNewParticipantRoleSelected(true);
            setParticipantDeletionAllowed(true);
        })
            .catch(error => {
                if (error.response.status === 400) {
                    setParticipantDeletionAllowed(false);
                    setIsNewParticipantFound(true);
                    setIsNewParticipantRoleSelected(true);
                }
            });
    }

    const addParticipant = () => {
        newParticipantData.projectId = project.projectId;
        axios.post('http://localhost:8080/project/participants/add', newParticipantData)
            .then(response => {
                setParticipants(response.data)
                setIsNewParticipantFound(true);
                setIsNewParticipantRoleSelected(true);
                setParticipantDeletionAllowed(true);
            })
            .catch(error => {
                if (error.response.status === 404) {
                    setIsNewParticipantFound(false);
                    setIsNewParticipantRoleSelected(true);
                    setParticipantDeletionAllowed(true);
                }
                if (error.response.status === 400) {
                    setIsNewParticipantRoleSelected(false);
                    setParticipantDeletionAllowed(true);
                }
            });
    };

    const handleTicketEditInputChange = (field, value) => {
        setEditableTicketData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleAddParticipantInputChange = (field, value) => {
        setNewParticipantData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    useEffect(() => {
        axios.get('http://localhost:8080/project/participants/' + project.projectId)
            .then(response => {
                setParticipants(response.data);
                setIsNewParticipantFound(true);
                setIsNewParticipantRoleSelected(true);
            })
            .catch(error => console.error('Error fetching participants:', error));
    }, [project]);

    const handleTicketCardClick = (ticket) => {
        console.log(ticket)
        setShowProjectTicketGrid(false);
        setShowTicketPage(true);
        setSelectedTicket(ticket);
        handleTaskClick(ticket);
    };

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
                    {tickets.map((ticket, index) => (
                        <div key={index} className="ticket-card" onClick={() => handleTicketCardClick(ticket)}>                            {editableTicketId === ticket.ticketId ? (
                            <>
                                <h3>{ticket.headline}</h3>
                                <select
                                    name="assignee"
                                    value={editableTicketData.assigneeId}
                                    onChange={(e) => handleTicketEditInputChange('assigneeId', e.target.value,)}
                                    required
                                >
                                    <option value="" disabled>Select assignee</option>
                                    {participants.map(participant => (
                                        <option key={participant.user.id} value={participant.user.id}>
                                            {participant.user.firstName} {participant.user.lastName}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={editableTicketData.status}
                                    onChange={(e) => handleTicketEditInputChange('status', e.target.value)}
                                >
                                    <option value="TO_DO">TO_DO</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="DONE">DONE</option>
                                </select>
                                <textarea
                                    value={editableTicketData.body}
                                    onChange={(e) => handleTicketEditInputChange('body', e.target.value)}
                                />
                            </>
                        ) : (
                            <>
                                <h3>{ticket.headline}</h3>
                                <p><strong>Assignee:</strong> {userMap[ticket.assigneeId]?.firstName} {userMap[ticket.assigneeId]?.lastName}</p>
                                <p><strong>Status:</strong> {ticket.status}</p>
                                <TruncatedText text={ticket.body} maxLength={300} />
                            </>
                        )}
                            <div className='button-container'>
                                <button
                                    className="edit-button"
                                    onClick={(event) => editableTicketId === ticket.ticketId ? handleSaveClick(event, ticket.ticketId) : handleEditClick(event, ticket.ticketId)}>
                                    {editableTicketId === ticket.ticketId ? 'Save' : 'Edit'}
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={(event) => handleDeleteClick(event, ticket.ticketId)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="participant-container">
                <h2>Participants</h2>
                <br />
                {
                    <form className="search-form">
                        <input
                            type="text"
                            placeholder="Search by username to add"
                            value={newParticipantData.username}
                            onChange={(e) => handleAddParticipantInputChange('username', e.target.value)}
                        />
                        <select
                            value={newParticipantData.role}
                            onChange={(e) => handleAddParticipantInputChange('role', e.target.value)}
                        >
                            <option value="" disabled>Select Role</option>
                            <option value="DEV">Developer</option>
                            <option value="QA">QA Specialist</option>
                            <option value="DESIGNER">Designer</option>
                            <option value="MANAGER">Manger</option>
                        </select>
                        <button className='add-participant-button'
                            type="button"
                            onClick={() => addParticipant()}>Add to Project</button>
                    </form>
                }
                <br />
                {(!isNewParticipantFound) &&
                    < div className="new-participant-error-message">
                        <p>User with that username not found</p>
                    </div>}
                {(!isNewParticipantRoleSelected) &&
                    < div className="new-participant-error-message">
                        <p>Specify the role</p>
                    </div>}
                {(!participantDeletionAllowed) &&
                    < div className="new-participant-error-message">
                        <p>Participant has tickets or is the creator, cannot be removed</p>
                    </div>}
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
                            <br />
                            <button className="delete-button" onClick={() => handleParticipantRemoveClick(participant.user.id)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default ProjectTicketsGrid;
