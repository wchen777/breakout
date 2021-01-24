import './App.scss';

import MainPage from './pages/MainPage';
import JoinPage from './pages/JoinPage';
import CreateRoomPage from './pages/CreateRoomPage';

import { BrowserRouter, Route, Switch } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/join-room" component={JoinPage} />
        <Route path="/create-room" component={CreateRoomPage} />
      </Switch>
  </BrowserRouter>
  );
}

export default App;
