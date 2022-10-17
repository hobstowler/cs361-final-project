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
        <div className='searchWrap'>
            <div className='search'>
                <form onSubmit={search}>
                    <input className='searchEntry' type='text' value={searchTerm} onChange={handleChange} />
                    <input type='submit' value='Search by Symbol' />
                </form>
            </div>
        </div>
    )
}