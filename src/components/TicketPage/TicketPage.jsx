import React, { useState, useEffect } from 'react';
import './TicketPage.css';
import axios from 'axios';

const TicketPage = ({ userId, ticket, setTicket, userAlltasks, setTicketsInMenu }) => {

    const [ticketAssignee, setTicketAssignee] = useState({
        firstName: '',
        lastName: ''
    });

    useEffect(() => {
        const fetchTicketAssignee = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/${ticket.assigneeId}`);
                setTicketAssignee(response.data);
            } catch (error) {
                console.error('Error fetching ticket assignee:', error);
            }
        };
    }, [ticket]);

    return (
        <div>
            <div className="ticket-headline">
                <h1>{ticket.headline}</h1>
                <br />
                <div className="participant-grid">
                </div>
            </div>
            <div className="ticket-assignee">
                <h1>Assignee: {ticketAssignee.firstName + ' ' + ticketAssignee.lastName}</h1>
                <br />
                <div className="participant-grid">
                </div>
            </div>
            <div className="ticket-body">
                <h1>{ticket.body}</h1>
                <br />
                <div className="participant-grid">
                </div>
            </div>
        </div>

    );
};

export default TicketPage;
