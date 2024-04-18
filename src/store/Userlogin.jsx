import React, { createContext, useState } from 'react';

const UserLoginContext = createContext();

const UserLoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = (userId) => {
    setUserId(userId);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <UserLoginContext.Provider value={{ isLoggedIn, userId, login, logout }}>
      {children}
    </UserLoginContext.Provider>
  );
};

export { UserLoginContext, UserLoginProvider };
