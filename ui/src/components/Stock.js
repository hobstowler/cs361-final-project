import {useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import {BiTrash, BiArrowToRight } from 'react-icons/bi';

export default function Stock({stock, removeStock, notify}) {
    const [price, setPrice] = useState(0)

    useEffect(() => {
        refresh()
    }, [])

    useEffect(() => {
        refresh()
    }, [notify])

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

    return (
        <tr className='stockItem'>
            <td className='stockName'> {stock.stock}</td>
            <td className='stockPrice'>{price.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
            <td><div className='stockRemove' onClick={remove}><BiTrash /></div></td>
            <td><Link className='stockToDetail' to={`/detail?stock=${stock.stock}`} ><BiArrowToRight /></Link></td>
        </tr>
    )
}