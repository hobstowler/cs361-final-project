import Login from "./Login";
import Cookies from "js-cookie";

export default function Header({username, setUsername}) {
    const logout = () => {
        setUsername('')
        Cookies.remove('username')
    }

    return(
        <div className='headerWrapper'>
            <div className='login'>
                {username ? <div className='logoutForm' onClick={logout}>Logout</div>: null}
                {username ?
                    <div className='loginForm'>Welcome back, {username}</div> :
                    <Login setUsername={setUsername} />}
            </div>
            <div className='header'>
                <h1>Boring Stock Tracker App</h1>
            </div>
        </div>
    )
}