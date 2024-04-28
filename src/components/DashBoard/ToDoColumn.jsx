import React from 'react';
import Ticket from './Ticket';

const ToDoColumn = ({ tickets }) => {
  return (
    <div className="column">
      <h3>To Do</h3>
      {tickets.map(ticket => (
        <Ticket key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export default ToDoColumn;