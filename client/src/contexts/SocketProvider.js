import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = React.createContext();
const SERVER_ENDPOINT = 'http://localhost:5000';

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ id, children }) {
    const [socket, setSocket] = useState();

    useEffect(() => {
        const newSocket = io(SERVER_ENDPOINT,
            { query: { id } });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}