import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';
import axios from 'axios';

require('dotenv').config();

const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:5000';

const ConversationsContext = React.createContext();

export function useConversations() {
    return useContext(ConversationsContext);
}

export function ConversationsProvider({ id, children }) {
    const [conversations, setConversations] = useState([]);
    const [conversationsLoaded, setConversationsLoaded] = useState(false);
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
    const { contacts } = useContacts();
    const socket = useSocket();

    // get data from db
    const getConversations = useCallback(async () => {
        const url = API_ENDPOINT + '/api/conversations/get-conversations';
        try {
            const res = await axios.get(url, { withCredentials: true });

            setConversations(res.data);
            setConversationsLoaded(true);
        } catch (err) {
            console.log(err);
        }
    }, [setConversations, setConversationsLoaded]);

    async function createConversation(recipients) {
        // add self to list of recipients
        recipients.push(id);
        const url = API_ENDPOINT + '/api/conversations/create-conversation';
        const data = {
            recipients: recipients
        };
        try {
            await axios.post(url, data, { withCredentials: true });
        } catch (err) {
            console.log(err);
        }
        getConversations();
    }

    useEffect(() => {
        if (socket == null) return;
        socket.on('receive-message', getConversations);

        return () => socket.off('receive-message');
    }, [socket, getConversations]);

    async function sendMessage(recipients, text) {
        // add self 
        recipients.push(id);

        socket.emit('send-message', { recipients, sender: id, text });
        getConversations();
    }

    const formattedConversations = conversations.map((conversation, index) => {
        let recipients = conversation.recipients.map(recipient => {
            const contact = contacts.find(contact => (
                contact.id === recipient
            ));
            const name = (contact && contact.name) || recipient;
            return { id: recipient, name };
        });

        // remove self
        recipients = recipients.filter(r => r.id !== id);

        const messages = conversation.messages.map(message => {
            const contact = contacts.find(contact => {
                return contact.id === message.sender;
            });
            const name = (contact && contact.name) || message.sender;
            const fromMe = id === message.sender;
            return { ...message, senderName: name, fromMe };
        });

        const selected = index === selectedConversationIndex;
        return { ...conversation, recipients, selected, messages }
    });

    const value = {
        conversations: formattedConversations,
        selectedConversation: formattedConversations[selectedConversationIndex],
        selectConversationIndex: setSelectedConversationIndex,
        createConversation,
        sendMessage,
        conversationsLoaded,
        getConversations
    };

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    );
}