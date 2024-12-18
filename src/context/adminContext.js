import React, { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

  const [profileDetails, setProfileDetails] = useState({});
  const [globalSkipButton, setGlobalSkipButton] = useState(false);

  return (
    <AdminContext.Provider
      value={{
        profileDetails,
        setProfileDetails,
        globalSkipButton,
        setGlobalSkipButton
      }}>
      {children}
    </AdminContext.Provider>
  );
};
