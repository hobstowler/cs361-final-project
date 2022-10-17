import {useState} from "react";

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        // TODO POST username/password to back end and get response
    }
    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    return (
        <form onSubmit={handleSubmit}>
            Register:
            <input type="text" onChange={handleUsernameChange} value={username} />
            <input type="password" onChange={handlePasswordChange} value={password} />
            <input type="submit" />
        </form>
    )
}