import {useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import Fundamentals from "../components/Fundamentals";
import Chart from "../components/Chart";

export default function Detail({stock, setStock, addStock}) {
    const [searchParams, setSearchParams] = useSearchParams()

    // update the stock in view when the search parameter changes
    useEffect(() => {
        let new_stock = searchParams.get('stock')
        setStock(new_stock)
    }, [searchParams])

    const add = (type) => {
        addStock(type, stock)
    }

    return (
        <div className='middle'>
            <h2>{stock.toUpperCase()} in the Charts</h2>
            <Chart symbol={stock} />
            <div className='detailButtons'>
                <button className='watchAdd' onClick={() => add('watchlist')}>Add to Watchlist</button>
                <button className='portfolioAdd' onClick={() => add('portfolio')}>Add to Portfolio</button>
            </div>
            <div className='yahooLink'>See it on <a href={`http://finance.yahoo.com/quote/${stock}`} target='_blank'>
                Yahoo Finance</a>
            </div>
            <Fundamentals stock={stock} />
        </div>
    )
}