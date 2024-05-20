import LoginForm from "./components/LoginForm/LoginForm";
import HomePage from "./components/HomePage/HomePage";
import React, { useState } from 'react';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);


  const handleLogin = (id, firstName, lastName) => {
    setId(id);
    setFirstName(firstName);
    setLastName(lastName);
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? <HomePage id={id} firstName={firstName} lastName={lastName} /> : <LoginForm onLogin={handleLogin} />}
    </div>
  );
}

export default App;
