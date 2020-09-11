import React, {useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from './views/login/LoginPage';
import AppView from './views/app/AppView';

function App() {
  const [jwt, setJWT] = useState<null|string>(null);
  const [username, setUsername] = useState<string>('username');

  useEffect(() => {checkLoginData();}, []);

  const checkLoginData = () => {
    const token = localStorage.getItem('schemaJWT');
    if (token){
        setJWT(token);
        let usernameLS: string|null = localStorage.getItem('schemaUsername');
        setUsername(usernameLS!);
    } else {
      setJWT(null);
      setUsername("username");
    }
  }

  return (
    <div className="App">
      { jwt && username ?
        <AppView jwt={jwt} username={username} callback={checkLoginData}/>
        :
        <LoginPage callback={checkLoginData}/>
      }
    </div>
  );
}

export default App;
