import React, { useState, useEffect } from 'react';
import './ProjectTicketsGrid.css';
import axios from "axios";



const ProjectTicketsGrid = ({ tickets }) => {
    const [userMap, setUserMap] = useState({});

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


    const handleEditClick = (ticketId) => {
        // Handle save click for the ticket with the given ID
        console.log(`Edit clicked for ticket ${ticketId}`);
      };
      return (
      <div className="grid-container">
        <h2>Tickets</h2>
        <div className="ticket-grid">
            {tickets.map((ticket, index) => (
            <div key={index} className="ticket-card">
                <h3>{ticket.headline}</h3>
                <p><strong>Assignee:</strong> {userMap[ticket.assigneeId]?.firstName} {userMap[ticket.assigneeId]?.lastName}</p>
                <p><strong>Status:</strong> {ticket.status}</p>
                <p><strong>Body:</strong> {ticket.body}</p>

                <button onClick={() => handleEditClick(ticket.id)}>Edit</button>
                </div>
            ))}
            </div>
        </div>
        );
    };

export default ProjectTicketsGrid;
