import {useState} from "react";
import Login from "./Login";
import Register from "./Register";

export default function Header({username, setUsername}) {
    const logout = () => {
        setUsername('')
    }

    return(
        <div class='headerWrapper'>
            <div class='login'>
                {username ? <div className='loginForm'>Welcome back, {username}</div> : <Login setUsername={setUsername} />}
                <br />
                {username ? <div className='logoutForm' onClick={logout}>Logout</div>: null}
            </div>
            <div class='header'>
                <h1>Boring Stock Tracker App</h1>
            </div>
        </div>
    )
}