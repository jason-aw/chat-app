import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useContacts } from '../contexts/ContactsProvider';
import { useConversations } from '../contexts/ConversationsProvider';

export default function NewConversationModal({ closeModal }) {
    const [selectedContactIDs, setSelectedContactIDs] = useState([]);
    const { contacts } = useContacts();
    const { createConversation } = useConversations();

    function handleSubmit(e) {
        e.preventDefault();
        createConversation(selectedContactIDs);
        closeModal();
    }

    function handleCheckboxChange(contactID) {
        setSelectedContactIDs(prevSelectedContactIDs => {
            if (prevSelectedContactIDs.includes(contactID)) {
                return prevSelectedContactIDs.filter(prevID => {
                    return contactID !== prevID
                })
            } else {
                return [...prevSelectedContactIDs, contactID]
            }
        })
    }

    return (
        <div>
            <Modal.Header closeButton>Create Conversation</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {contacts.map(contact => (
                        <Form.Group controlId={contact.id} key={contact.id}>
                            <Form.Check
                                type="checkbox"
                                value={selectedContactIDs.includes(contact.id)}
                                label={contact.name}
                                onChange={() => handleCheckboxChange(contact.id)} />
                        </Form.Group>
                    ))}
                    <Button type="submit">Create</Button>
                </Form>
            </Modal.Body>
        </div>
    );
}