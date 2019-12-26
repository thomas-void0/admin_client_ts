import React from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';

import Login from './views/login/Login';
import Admin from './views/admin/Admin';


const App: React.FC = () => {
  return (
    <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/" component={Admin}/>
        </Switch>
    </BrowserRouter>
  );
}

export default App;
