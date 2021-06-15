import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthProvider';
import { useHistory } from 'react-router-dom';

export default function Register() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { register, registerMessage } = useAuth();
    const [message, setMessage] = useState({});
    let history = useHistory();
    const redirect = () => {
        history.push('/login')
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        register(emailRef.current.value, passwordRef.current.value);

    }

    useEffect(() => {
        setMessage(registerMessage);
    }, [setMessage, registerMessage]);

    return (
        <Container className="d-flex align-items-center" style={{ height: '100vh' }}>
            <Form className="w-100" onSubmit={handleSubmit}>
                {message && message.error &&
                    <Alert variant="danger">
                        {message.error}
                    </Alert>}
                {message && message.success &&
                    <Alert variant="success">
                        {message.success}
                    </Alert>}
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="your email" ref={emailRef} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="your password" ref={passwordRef} required />
                </Form.Group>
                <Form.Group>
                    <Button type="submit" className="me-2" variant="light">Register</Button>
                    <Button onClick={redirect} variant="dark">Back to Login</Button>
                </Form.Group>
            </Form>
        </Container >
    );
}
