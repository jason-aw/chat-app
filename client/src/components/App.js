import React from 'react';
import { ContactsProvider } from '../contexts/ContactsProvider';
import { ConversationsProvider } from '../contexts/ConversationsProvider';
import { SocketProvider } from '../contexts/SocketProvider';
import { useAuth } from '../contexts/AuthProvider';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';

function App() {
  const { user } = useAuth();
  // console.log(user);
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            {!user.isAuth ? <Login /> :
              <SocketProvider id={user.id}>
                <ContactsProvider id={user.id}>
                  <ConversationsProvider id={user.id}>
                    <Dashboard id={user.id} />
                  </ConversationsProvider>
                </ContactsProvider>
              </SocketProvider>
            }
          </Route>
          <Route path="/login">
            {!user.isAuth ? <Login /> : <Redirect to='/' />}
          </Route>
          <Route path="/register">
            {!user.isAuth ? <Register /> : <Redirect to='/' />}
          </Route>

        </Switch>
      </Router>
    </>
  );
}

export default App;
