import React, { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Both fields are required.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError(''); // Clear any existing errors

        try {
            const adminDoc = await getDoc(doc(db, 'admin', email));
            if (adminDoc.exists()) {
                const adminData = adminDoc.data();
                if (adminData.password === password) {
                    onLogin();
                } else {
                    setError('Incorrect password.');
                }
            } else {
                setError('User does not exist.');
            }
        } catch (err) {
            console.error("Error logging in:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div style={styles.screenContainer}> {/* Full-screen container with gradient background */}
            <div style={styles.formContainer}>
                <h2 style={styles.heading}>Login</h2> {/* Center the Login text */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Email Input */}
                    <div style={styles.inputGroup}>
                        {/* <label htmlFor="email">Email:</label> */}
                        <div style={styles.inputContainer}>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                                placeholder="Enter your email"
                            />
                            <FaEnvelope style={styles.icon} />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div style={styles.inputGroup}>
                        {/* <label htmlFor="password">Password:</label> */}
                        <div style={styles.inputContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                                placeholder="Enter your password"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.icon}
                                role="button"
                                aria-label="Toggle Password Visibility"
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <p style={styles.error}>{error}</p>}

                    <button type="submit" style={styles.button}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

// Styles
const styles = {
    screenContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full height of the viewport
        background: "linear-gradient(to bottom, #004dcf, #4dcfff)", // Gradient background
    },
    formContainer: {
        maxWidth: "400px",
        width: "90%",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center", // Center-align text inside the form
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    inputGroup: {
        marginBottom: "15px",
    },
    inputContainer: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "0 10px",
    },
    input: {
        flex: 1,
        padding: "10px",
        border: "none",
        borderRadius: "4px",
        outline: "none",
        width: "100%", // Ensures input takes full width
    },
    icon: {
        padding: "10px",
        fontSize: "18px",
        color: "#555",
        cursor: "pointer",
    },
    error: {
        color: "red",
        fontSize: "14px",
        marginBottom: "10px",
    },
    button: {
        backgroundColor: "#004dcf",
        color: "#fff",
        padding: "10px 15px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
        width: "100%",
    },
    heading: {
        marginBottom: "20px",
        color: "#004dcf",
    },
};

export default Login;
