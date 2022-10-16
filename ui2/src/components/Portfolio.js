import {useEffect, useState} from "react";
import PortfolioItem from "./PortfolioItem";

export default function Portfolio({username}) {
    const [portfolio, setPortfolio] = useState([])

    useEffect(() => {
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

                console.log('data', data)
                if (data !== null && data.length > 0) {
                    setPortfolio('data', data)
                }
            })
    })

    return(
        <div>
            <h2>Portfolio for {username}</h2>
            {portfolio.map((stock, i) => <PortfolioItem stock={stock} key={i} />)}
        </div>
    )
}