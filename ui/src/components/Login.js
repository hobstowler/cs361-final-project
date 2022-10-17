import {useState} from "react";
import Cookies from "js-cookie";

export default function Login({setUsername}) {
    const [register, setRegister] = useState(false)
    const [username, changeUsername] = useState('')
    const [password, changePassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!username || !password) {
            return
        }

        // TODO POST username/password to back end and get response
        if (register) {
            fetch(`/register`, {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify({
                    'username': username,
                    'password': password
                })
            })
                .then(async response => {
                    const hasJson = response.headers.get('content-type')?.includes('application/json')
                    const data = hasJson ? await response.json() : null

                    if (!response.ok) {
                        let error = (data && data.error) || response.status
                        return Promise.reject(error)
                    }

                    setUsername(username)
                    Cookies.set('username', username)
                })
        } else {
            fetch('/login', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify({
                    'username': username,
                    'password': password
                })
            })
                .then(async response => {
                    const hasJson = response.headers.get('content-type')?.includes('application/json')
                    const data = hasJson ? await response.json() : null

                    if (!response.ok) {
                        let error = (data && data.error) || response.status
                        return Promise.reject(error)
                    }

                    setUsername(username)
                    Cookies.set('username', username)
                })
        }
    }
    const handleUsernameChange = (e) => {
        changeUsername(e.target.value)
    }
    const handlePasswordChange = (e) => {
        changePassword(e.target.value)
    }
    const handleRegisterChange = () => {
        setRegister(!register)
    }

    return (
        <div className='loginForm'>
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={handleUsernameChange} value={username} />
                <input type="password" onChange={handlePasswordChange} value={password} />
                <input type="submit" value={register ? 'Register' : 'Log In'}/>
            </form>
            <button onClick={handleRegisterChange}>{register ? 'Cancel' : 'New User?'}</button>
        </div>
    )
}