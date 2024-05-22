import LoginForm from "./components/LoginForm/LoginForm";
import HomePage from "./components/HomePage/HomePage";
import React, { useState, useEffect } from 'react';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem('id');
    const storedFirstName = localStorage.getItem('firstName');
    const storedLastName = localStorage.getItem('lastName');
    
    if (storedId && storedFirstName && storedLastName) {
      setId(storedId);
      setFirstName(storedFirstName);
      setLastName(storedLastName);
      setIsLoggedIn(true);
    }
  }, []);


  const handleLogin = (id, firstName, lastName) => {
    localStorage.setItem('id', id);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);

    setId(id);
    setFirstName(firstName);
    setLastName(lastName);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('id');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    
    setId(null);
    setFirstName(null);
    setLastName(null);
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <HomePage id={id} firstName={firstName} lastName={lastName} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
