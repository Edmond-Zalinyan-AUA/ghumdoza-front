import React, { useState, useEffect } from 'react';
import './ProjectTicketsGrid.css';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";

const ProjectTicketsGrid = ({ tickets, userAlltasks, setTicketsInMenu }) => {

    const [ticketsInGrid, setTicketsInGrid] = useState(tickets);
    const [userMap, setUserMap] = useState({});
    const [editableTicketId, setEditableTicketId] = useState("");
    const [editableTicketData, setEditableTicketData] = useState({});
    const [showSearchForm, setShowSearchForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setTicketsInGrid(tickets);
    }, [tickets]);

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
            headline: ticketToEdit.headline,
            status: ticketToEdit.status,
            body: ticketToEdit.body,
            assigneeId: ticketToEdit.assigneeId
        });
    };

    const handleSaveClick = (ticketId) => {
        // Handle save functionality here
        console.log('Saving ticket:', editableTicketData);
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

    return (
        <div className="grid-container">
            <h2>Tickets</h2>
            <div className="ticket-grid">
                {ticketsInGrid.map((ticket, index) => (
                    <div key={index} className="ticket-card">
                        {editableTicketId === ticket.ticketId ? (
                            <>
                                <h3>{ticket.headline}</h3>
                                <div className="input-with-icon">
                                    <input
                                        type="text"
                                        value={userMap[ticket.assigneeId]?.firstName + ' ' + userMap[ticket.assigneeId]?.lastName}
                                        readOnly
                                    />
                                    <span className="search-icon" onClick={handleSearchClick}><FaSearch /></span>
                                </div>
                                {showSearchForm && (
                                    <form onSubmit={handleSearchSubmit} className="search-form">
                                        <input
                                            type="text"
                                            placeholder="Search by username"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button type="submit">Search</button>
                                    </form>
                                )}
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
    );
};

export default ProjectTicketsGrid;
