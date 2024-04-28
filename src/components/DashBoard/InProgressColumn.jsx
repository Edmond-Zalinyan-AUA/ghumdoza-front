import React from 'react';
import Ticket from './Ticket';

const InProgressColumn = ({ tickets }) => {
  return (
    <div className="column">
      <h3>In Progress</h3>
      {tickets.map(ticket => (
        <Ticket key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export default InProgressColumn;
