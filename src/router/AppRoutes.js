import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import PickersScreen from '../pages/PickersScreen';
import WalletScreen from '../pages/WalletScreen';
import ReportScreen from '../pages/ReportScreen';
import AddPickerScreen from '../pages/AddPickerScreen';
import ViewProfileScreen from '../pages/ViewProfileScreen';
import SettingsScreen from '../pages/SettingsScreen';

function AppRoutes() {

    const [isLoggedIn, setIsLoggedIn] = useState(
        JSON.parse(localStorage.getItem("isLoggedIn")) || false
    );

    // Sync isAuthenticated with localStorage
    useEffect(() => {
        localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={isLoggedIn ? <Navigate to="/Dashboard" replace /> : <Login onLogin={handleLogin} />}
                />
                <Route
                    path="/Dashboard"
                    element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" replace />}
                />
                <Route path="/pickers" element={<PickersScreen />} />
                <Route path="/wallet" element={<WalletScreen />} />
                <Route path="/report" element={<ReportScreen />} />\
                <Route path="/settings" element={<SettingsScreen />} />
                <Route path="/add-picker" element={<AddPickerScreen />} />
                <Route path='/view-profile' element={<ViewProfileScreen />} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;
