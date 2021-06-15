import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

require('dotenv').config();

const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:5000';
const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState({});
    const [registerMessage, setRegisterMessage] = useState({});

    function getCurrentUser() {
        const url = API_ENDPOINT + '/api/users/auth';
        axios.get(url, { withCredentials: true })
            .then(res => {
                setUser(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    function login(email, password) {
        const url = API_ENDPOINT + '/api/users/login';
        const data = {
            email, password
        };
        axios.post(url, data, { withCredentials: true })
            .then(() => {
                getCurrentUser();
            }).catch((err) => {
                console.log(err);
            });
    }

    function register(email, password) {
        const url = API_ENDPOINT + '/api/users/register';
        const data = {
            email, password
        };

        axios.post(url, data, { withCredentials: true })
            .then(res => {
                // console.log(res.data);
                setRegisterMessage(res.data);
            })
            .catch((err) => {
                // console.log(err.response.data);
                setRegisterMessage(err.response.data);
            });
    }

    function logout() {
        const url = API_ENDPOINT + '/api/users/logout';
        axios.get(url, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }

    const value = {
        login,
        logout,
        register,
        user,
        registerMessage
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}