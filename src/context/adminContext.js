import React, { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

  const [profileDetails, setProfileDetails] = useState({})

  return (
    <AdminContext.Provider
      value={{
        profileDetails,
        setProfileDetails
      }}>
      {children}
    </AdminContext.Provider>
  );
};
