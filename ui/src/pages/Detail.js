import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Watchlist from "../components/Watchlist";
import Portfolio from "../components/Portfolio";
import Fundamentals from "../components/Fundamentals";
import Stories from "../components/Stories";
import Chart from "../components/Chart";

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
        fetch(`/watchlist/${username}/${stock.toUpperCase()}`, {
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
        fetch(`/portfolio/${username}/${stock.toUpperCase()}`, {
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
            <div className='middle'>
                <Chart symbol={stock} />
                <div className='detailButtons'>
                    <button className='watchAdd' onClick={addStockToWatchlist}>Add to Watchlist</button>
                    <button className='portfolioAdd' onClick={addStockToPortfolio}>Add to Portfolio</button>
                </div>
                <div className='yahooLink'>See it on <a href={`http://finance.yahoo.com/quote/${stock}`} target='_blank'>Yahoo Finance</a></div>
                <Fundamentals stock={stock} />
            </div>
            <div className='right'>
                <Stories stock={stock} /></div>
        </div>
    )
}