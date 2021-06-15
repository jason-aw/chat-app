import React, { useCallback, useContext, useState } from 'react';
import axios from 'axios';

const API_ENDPOINT = require('../config');
const ContactsContext = React.createContext();

export function useContacts() {
    return useContext(ContactsContext);
}

export function ContactsProvider({ children }) {
    const [contacts, setContacts] = useState([]);
    const [contactsLoaded, setContactsLoaded] = useState(false);

    // get data from db
    const getContacts = useCallback(async () => {
        const url = API_ENDPOINT + '/api/conversations/get-contacts';
        try {
            const res = await axios.get(url, { withCredentials: true });
            setContacts(res.data);
            setContactsLoaded(true);
        } catch (err) {
            console.log(err);
        }
    }, [setContacts, setContactsLoaded]);

    async function createContact(addUserId, name) {
        const url = API_ENDPOINT + '/api/conversations/add-contact';
        const data = {
            id: addUserId,
            name: name,
        };
        try {
            await axios.post(url, data, { withCredentials: true });
        } catch (err) {
            console.log(err);
        }
        getContacts();
    }

    return (
        <ContactsContext.Provider value={{ contacts, createContact, contactsLoaded, getContacts }}>
            {children}
        </ContactsContext.Provider>
    );
}