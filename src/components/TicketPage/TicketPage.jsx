import React, { useState, useEffect } from 'react';
import './TicketPage.css';
import axios from 'axios';

const TicketPage = ({ userId, ticket, setTicket, userAlltasks, setTicketsInMenu }) => {

    const [ticketAssignee, setTicketAssignee] = useState({
        id: '',
        firstName: '',
        lastName: ''
    });
    const [editableTicketData, setEditableTicketData] = useState({
        headline: '',
        assigneeId: '',
        body: '',
        status: ''
    });
    const [participants, setParticipants] = useState([]);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:8080/user/${ticket.assigneeId}`)
            .then(response => {
                setTicketAssignee(response.data)
            })
            .catch(error => { console.error('Error fetching ticket assignee:', error); });
    }, [ticket]);

    useEffect(() => {
        axios.get('http://localhost:8080/project/participants/' + ticket.projectId)
            .then(response => {
                setParticipants(response.data);
            })
            .catch(error => console.error('Error fetching participants:', error));
    }, [ticket]);

    const handleEditClick = () => {
        setEditMode(true);
        setEditableTicketData({
            ticketId: ticket.ticketId,
            status: ticket.status,
            body: ticket.body,
            assigneeId: ticket.assigneeId
        });
    };

    const handleSaveClick = () => {
        axios.post('http://localhost:8080/ticket/update', editableTicketData)
            .then(response => {
                if (response.status === 200) {
                    setTicket(response.data);
                    if (editableTicketData.assigneeId !== userId) {
                        setTicketsInMenu([...userAlltasks].filter(t => t.ticketId !== response.data.ticketId));
                    }
                }
            })
            .catch(error => console.error('Error editing ticket:', error));

        // Reset the editable state
        setEditMode(false);
        setEditableTicketData({});
    };

    const enhanceWithAi = () => {

    };

    const handleTicketEditInputChange = (field, value) => {
        setEditableTicketData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };


    return (
        <div>
            <div className="ticket-headline">
                <h1>{ticket.headline}</h1>
                <br />
            </div>
            <div className="ticket-assignee">
                <br />
                {editMode ? (
                    <>
                        <h1><strong>Assignee:  </strong>
                            <select
                                className='select-assignee'
                                name="assignee"
                                value={editableTicketData.assigneeId}
                                onChange={(e) => handleTicketEditInputChange('assigneeId', e.target.value,)}
                                required
                            >
                                <option value="" disabled>Select assignee</option>
                                {participants.map(participant => (
                                    <option value={participant.user.id}>
                                        {participant.user.firstName} {participant.user.lastName}
                                    </option>
                                ))}
                            </select>
                        </h1>
                        <br />
                        <h1><strong>Status:  </strong>
                            <select
                                className='select-status'
                                value={editableTicketData.status}
                                onChange={(e) => handleTicketEditInputChange('status', e.target.value)}
                            >
                                <option value="TO_DO">TO DO</option>
                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                <option value="DONE">DONE</option>
                            </select>
                        </h1>
                    </>
                ) : (
                    <>
                        <h1><strong>Assignee:</strong> {ticketAssignee.firstName + ' ' + ticketAssignee.lastName}</h1>
                        <br />
                        <h1><strong>Status:</strong> {ticket.status}</h1>
                    </>
                )}
            </div>
            <div className="ticket-body">
                {editMode ? (
                    <>
                        <textarea className="ticket-body-text"
                            value={editableTicketData.body}
                            onChange={(e) => handleTicketEditInputChange('body', e.target.value)}
                        />
                    </>
                ) : (
                    <>
                        <p>{ticket.body}</p>
                    </>
                )}
                <br />
                <div className='ticket-edit-button-container'>
                    <button className="edit-button" onClick={() => editMode ? handleSaveClick() : handleEditClick()}>
                        {editMode ? 'Save' : 'Edit'}
                    </button>
                    {editMode ? (<button className="edit-button" onClick={() => enhanceWithAi()}>
                        Enhance with AI
                    </button>) : ''}
                </div>
            </div>
        </div>

    );
};

export default TicketPage;
