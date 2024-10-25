import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const signin = (id, callback) => {
    setUserId(id);
    callback();
  };

  const signout = (callback) => {
    setUserId(null);
    callback();
  };

  return (
    <AuthContext.Provider value={{ userId, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
