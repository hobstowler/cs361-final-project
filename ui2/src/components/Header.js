import {useState} from "react";
import Login from "./Login";
import Register from "./Register";

export default function Header({username, setUsername}) {
    return(
        <div class='headerWrapper'>
            <div class='login'>
                {username ? <div className='loginForm'>Welcome back, {username}</div> : <Login setUsername={setUsername} />}
            </div>
            <div class='header'>
                <h1>Boring Stock Tracker App</h1>
            </div>
        </div>
    )
}