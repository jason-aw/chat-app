import React, { useEffect } from 'react';
import { useContacts } from '../contexts/ContactsProvider';
import { ListGroup } from 'react-bootstrap';

export default function Contacts() {
    const { contacts, getContacts } = useContacts();

    useEffect(() => {
        getContacts();
    }, [getContacts]);

    return (
        <ListGroup variant="flush">
            {contacts.map(contact => (
                <ListGroup.Item key={contact.id}>
                    {contact.name}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}