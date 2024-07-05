import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [message, setMessage] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const resetErrors = () => {
    setFirstNameError('');
    setLastNameError('');
    setUsernameError('');
    setPasswordError('');
  };

  const handleRegister = () => {
   
    resetErrors();
    setMessage('');


    let valid = true;
    if (!firstName) {
      setFirstNameError('First Name is required');
      valid = false;
    }
    if (!lastName) {
      setLastNameError('Last Name is required');
      valid = false;
    }
    if (!username) {
      setUsernameError('Username is required');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }

    if (!valid) {
      return;
    }

   
    axios.post('http://localhost:3001/register', { firstName, lastName, username, password })
      .then(response => {
        setMessage(response.data.message);
        setShowRegisterForm(false); // Switch to login form after successful registration
        setFirstName('');
        setLastName('');
        setUsername('');
        setPassword('');
      })
      .catch(error => {
        setMessage(error.response?.data?.message ||'Registration error');
      });
  };

  const handleLogin = () => {
    // Reset all error messages
    resetErrors();
    setMessage('');

    // Validate inputs
    let valid = true;
    if (!username) {
      setUsernameError('Username is required');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }

    if (!valid) {
      return;
    }

    // API call for login
    axios.post('http://localhost:3001/login', { username, password })
      .then(response => {
        setMessage(response.data.message);
        if (response.data.token) {
          setIsLoggedIn(true);
          localStorage.setItem('token', response.data.token);
          setFirstName(response.data.user.firstName);
          setLastName(response.data.user.lastName);
        }
        setUsername('');
        setPassword('');
      })
      .catch(error => {
        setMessage(error.response?.data?.message || 'Login error');
      });
  };

  // Clear error messages when user edits the input fields
  useEffect(() => {
    resetErrors();
  }, [username, password, firstName, lastName]);

  return (
    <div className="App">
      <h1>Ecommerce</h1>
      {!isLoggedIn ? (
        <div className="form-container">
          {showRegisterForm ? (
            <div className="form">
              <h2>Register</h2>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {firstNameError && <p className="error">{firstNameError}</p>}
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {lastNameError && <p className="error">{lastNameError}</p>}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && <p className="error">{usernameError}</p>}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className="error">{passwordError}</p>}
              <button onClick={handleRegister}>Register</button>
              <p>
                Already have an account? <button onClick={() => {
                  setShowRegisterForm(false);
                  resetErrors();
                  setMessage('');
                  setFirstName('');
                  setLastName('');
                  setUsername('');
                  setPassword('');
                }}>Login</button>
              </p>
            </div>
          ) : (
            <div className="form">
              <h2>Login</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && <p className="error">{usernameError}</p>}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className="error">{passwordError}</p>}
              <button onClick={handleLogin}>Login</button>
              <p>
                Don't have an account? <button onClick={() => {
                  setShowRegisterForm(true);
                  resetErrors();
                  setMessage('');
                  setUsername('');
                  setPassword('');
                }}>Register</button>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Welcome, {firstName} {lastName}!</p>
        </div>
      )}
      <p className="message">{message}</p>
    </div>
  );
}

export default App;
