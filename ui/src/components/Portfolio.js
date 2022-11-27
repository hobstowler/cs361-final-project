import {useEffect, useState} from "react";
import Stock from "./Stock";

export default function Portfolio({username, notify, removeStock}) {
    const [portfolio, setPortfolio] = useState([])

    useEffect(() => {
        if (username) {
            setPortfolio([])
        }
    }, [username])

    useEffect(() => {
        setPortfolio([])
    }, [notify])

    useEffect(() => {
        refresh()
    }, [portfolio])

    const refresh = () => {
        fetch(`/portfolio/${username}`, {
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
                setPortfolio(data)
            }
        })
    }

    const remove = (stock) => {
        removeStock('portfolio', stock)
    }

    return(
        <div className='portfolio'>
            <h2>Portfolio</h2>
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
                {portfolio.map((stock, i) => <Stock stock={stock}
                                                    notify={notify}
                                                    removeStock={remove}
                                                    key={i} />)}
                </tbody>
            </table>
        </div>
    )
}