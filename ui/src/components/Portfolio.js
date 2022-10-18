import {useEffect, useState} from "react";
import PortfolioItem from "./PortfolioItem";

export default function Portfolio({username, notify, setNotify}) {
    const [portfolio, setPortfolio] = useState([])

    useEffect(() => {
        if (username) {
            refresh()
        } else {
            setPortfolio([])
        }
    }, [username])

    useEffect(() => {
        if (notify === true) {
            refresh()
            setNotify(false)
        }
    }, [notify])

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

    const removeStock = (stock) => {
        fetch(`/portfolio/${username}/${stock}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.status === 204) {
                    refresh()
                }
            })
    }

    return(

        <div>
            <h2>Portfolio for {username}</h2>
            {portfolio.map((stock, i) => <PortfolioItem stock={stock} removeStock={removeStock} key={i} />)}
        </div>
    )
}