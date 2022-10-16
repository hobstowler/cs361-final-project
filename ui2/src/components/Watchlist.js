import {useEffect, useState} from "react";

export default function Watchlist({username}) {
    const [watchlist, setWatchList] = useState([])

    useEffect(() => {
        fetch(`/watchlist/${username}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
            .then(async response => {
                const hasJson = response.headers.get('content-type')?.includes('application/json')
                const data = hasJson ? await response.json() : null
            })
    }, [])

    return (
        <div>
            <h2>Watch List for {username}</h2>
        </div>
    )
}