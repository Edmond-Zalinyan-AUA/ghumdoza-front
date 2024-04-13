import LoginForm from "./components/LoginForm/LoginForm";
import HomePage from "./components/HomePage/HomePage";
import React, { useState } from 'react';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  return (
    <div>
      {isLoggedIn ? <HomePage /> : <LoginForm onLogin={() => setIsLoggedIn(true)} />}
    </div>
  );
}

export default App;
