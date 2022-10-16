import {useState} from "react";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState('')
    const search = (e) => {
        e.preventDefault()
    }

    return (
        <div>
            <form onSubmit={search}>
                <input type='text' value={searchTerm} />
                <input type='submit' value='Search' />
            </form>
        </div>
    )
}