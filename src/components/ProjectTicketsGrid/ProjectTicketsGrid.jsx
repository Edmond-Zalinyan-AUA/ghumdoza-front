import React from 'react';
import './ProjectTicketsGrid.css';


const ProjectTicketsGrid = ({ tickets }) => {


    const handleSaveClick = (ticketId) => {
        // Handle save click for the ticket with the given ID
        console.log(`Save clicked for ticket ${ticketId}`);
      };
      return (
      <div className="grid-container">
        <h2>Tickets</h2>
        <div className="ticket-grid">
            {tickets.map((ticket, index) => (
            <div key={index} className="ticket-card">
                <h3>{ticket.headline}</h3>
                <p><strong>Assignee:</strong> {ticket.assignee}</p>
                <p><strong>Status:</strong> {ticket.status}</p>
                <button onClick={() => handleSaveClick(ticket.id)}>Save</button>
                </div>
            ))}
            </div>
        </div>
        );
    };

export default ProjectTicketsGrid;
