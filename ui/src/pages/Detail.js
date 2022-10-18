import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Watchlist from "../components/Watchlist";
import Portfolio from "../components/Portfolio";
import Fundamentals from "../components/Fundamentals";
import Stories from "../components/Stories";

export default function Detail({username}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const [stock, setStock] = useState(searchParams.get('stock'))
    const [watchNotify, setWatchNotify] = useState(false)
    const [portfolioNotify, setPortfolioNotify] = useState(false)

    useEffect(() => {
        console.log('change detected')
        setStock(searchParams.get('stock'))
    }, [searchParams])

    const addStockToWatchlist = () => {
        fetch(`/watchlist/${username}/${stock}`, {
            method: 'POST'
        })
            .then(async response => {
                const hasJson = response.headers.get('content-type')?.includes('application/json')
                const data = hasJson ? await response.json() : null

                if (!response.ok) {
                    let error = (data && data.error) || response.status
                    return Promise.reject(error)
                }
                setWatchNotify(true)
            })
    }

    const addStockToPortfolio = () => {
        fetch(`/portfolio/${username}/${stock}`, {
            method: 'POST'
        })
            .then(async response => {
                const hasJson = response.headers.get('content-type')?.includes('application/json')
                const data = hasJson ? await response.json() : null

                if (!response.ok) {
                    let error = (data && data.error) || response.status
                    return Promise.reject(error)
                }
                setPortfolioNotify(true)
            })
    }

    return (
        <div className='bodyWrap'>
            <div className='left'>
                <Watchlist username={username} notify={watchNotify} setNotify={setWatchNotify}/>
                <Portfolio username={username} notify={portfolioNotify} setNotify={setPortfolioNotify}/>
            </div>
            <div id='right'>
                <div className='detailButtons'>
                    <button className='watchAdd' onClick={addStockToWatchlist}>Add to Watchlist</button>
                    <button className='portfolioAdd' onClick={addStockToPortfolio}>Add to Portfolio</button>
                </div>
                <Fundamentals stock={stock} />
                <Stories stock={stock} />
            </div>
        </div>
    )
}