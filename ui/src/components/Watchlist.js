import {useEffect, useState} from "react";
import WatchListItem from "./WatchlistItem";

export default function Watchlist({username, notify, setNotify}) {
    const [watchlist, setWatchList] = useState([])

    useEffect(() => {
        if (username) {
            refresh()
        } else {
            setWatchList([])
        }
    }, [username])

    useEffect(() => {
        if (notify === true) {
            refresh()
            setNotify(false)
        }
    }, [notify])

    const refresh = () => {
        fetch(`/watchlist/${username}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        })
        .then(async response => {
            const hasJson = response.headers.get('content-type')?.includes('application/json')
            const data = hasJson ? await response.json() : null

            if (!response.ok) {
                let error = (data && data.error) || response.status
                return Promise.reject(error)
            }

            if (data !== null && data.length > 0) {
                setWatchList(data)
            }
        })
    }

    const removeStock = (stock) => {
        fetch(`/watchlist/${username}/${stock}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.status === 204) {
                    refresh()
                }
            })
    }

    return (
        <div>
            <h2>Watch List for {username ? username : 'a new user?'}</h2>
            {username ? null : 'Sign in to get started. Once you do, all of the stocks from your watchlist will be displayed here.'}
            {watchlist.map((stock, i) => <WatchListItem stock={stock} notify={notify} removeStock={removeStock} key={i} />)}
        </div>
    )
}