import {useEffect, useState} from "react";
import Stock from "./Stock";

export default function Watchlist({username, notify, removeStock}) {
    const [watchlist, setWatchList] = useState([])

    useEffect(() => {
        if (username) {
            setWatchList([])
        }
    }, [username])

    useEffect(() => {
        setWatchList([])
    }, [notify])

    useEffect(() => {
        refresh()
    }, [watchlist])

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

    const remove = (stock) => {
        removeStock('watchlist', stock)
    }

    return (
        <div className='watchList'>
            <h2>Watchlist</h2>
            {username ? null :
                'Sign in to get started. Once you do, all of the stocks from your watchlist will be displayed here.'}
            <table cellPadding={0} cellSpacing={0}>
                <thead>
                <tr>
                    <th>Stock</th>
                    <th>Price</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    {watchlist.map((stock, i) => <Stock stock={stock}
                                                        notify={notify}
                                                        removeStock={remove}
                                                        key={i} />)}
                </tbody>
            </table>
        </div>
    )
}