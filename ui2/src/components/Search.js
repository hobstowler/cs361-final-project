import {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const search = (e) => {
        e.preventDefault()
        navigate(`/detail?stock=${searchTerm}`)
    }

    const handleChange = (e) => {
        setSearchTerm(e.target.value)
    }

    return (
        <div>
            <form onSubmit={search}>
                <input type='text' value={searchTerm} onChange={handleChange} />
                <input type='submit' value='Search' />
            </form>
        </div>
    )
}