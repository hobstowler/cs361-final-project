import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

export default function PortfolioItem({stock, removeStock}) {
    const [price, setPrice] = useState(0)

    useEffect(() => {
        refresh()
    }, [])

    const refresh = () => {
        fetch(`/quote/${stock.stock}`, {
            method: 'GET',
            headers: {'content-type': 'application/json'}
        })
            .then(async response => {
                const hasJson = response.headers.get('content-type')?.includes('application/json')
                const data = hasJson ? await response.json() : null

                if (!response.ok) {
                    let error = (data && data.error) || response.status
                    return Promise.reject(error)
                }
                if (data !== null) {
                    setPrice(data.c)
                }
            })
    }

    const remove = () => {
        removeStock(stock.stock)
    }

    const detail = () => {

    }

    return (
        <div className='stockItem'>
            <span className='stockName'> {stock.stock}</span>
            <span className='stockPrice'>{price.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</span>
            <button className='stockRemove' onClick={remove}>Remove</button>
            <Link className='stockToDetail' to={`/detail?stock=${stock.stock}`} >See Detail</Link>
        </div>
    )
}