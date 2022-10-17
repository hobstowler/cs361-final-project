import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Cookies from "js-cookie";
import {useState, useEffect} from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Search from "./components/Search";


function App() {
    const [username, setUsername] = useState('')

    useEffect(() => {
        let username = Cookies.get('username')
        if (username !== undefined) {
            setUsername(username)
        }
    }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Header username={username} setUsername={setUsername} />
        <Search />
        <Routes>
          <Route path="/" element={<Home username={username} />}/>
          <Route path="/detail" element={<Detail username={username} />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
