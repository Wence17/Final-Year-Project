"use client"
import { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [usersList, setUsersList] = useState([]);

  return (
    <UserContext.Provider value={{ usersList, setUsersList }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };