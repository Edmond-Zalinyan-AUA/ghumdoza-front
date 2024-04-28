import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ToDoColumn from './ToDoColumn';
import InProgressColumn from './InProgressColumn';

const Dashboard = () => {
  // Sample ticket data
  const tickets = [
    { id: '1', title: 'Ticket 1', status: 'to-do' },
    { id: '2', title: 'Ticket 2', status: 'in-progress' },
    { id: '3', title: 'Ticket 3', status: 'done' },
    { id: '4', title: 'Ticket 4', status: 'canceled' },
    // Add more ticket data as needed
  ];

  // Function to handle drag and drop events
  const onDragEnd = (result) => {
    // Logic to update ticket status based on drag and drop result
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="dashboard">
        <Droppable droppableId="columns" direction="horizontal" type="column">
          {(provided) => (
            <div className="columns" {...provided.droppableProps} ref={provided.innerRef}>
              <ToDoColumn tickets={tickets.filter(ticket => ticket.status === 'to-do')} />
              <InProgressColumn tickets={tickets.filter(ticket => ticket.status === 'in-progress')} />
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default Dashboard;
