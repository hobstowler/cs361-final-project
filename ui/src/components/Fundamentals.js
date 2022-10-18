import {useEffect, useState} from "react";

export default function Fundamentals({stock}) {
    const [fundamentals, setFundamentals] = useState({})

    useEffect(() => {
        fetch(`/financials/${stock}`, {
            method: 'GET'
        })
            .then(async response => {
                const hasJson = response.headers.get('content-type')?.includes('application/json')
                const data = hasJson ? await response.json() : null

                if (!response.ok) {
                    let error = (data && data.error) || response.status
                    return Promise.reject(error)
                }
                setFundamentals(data)
            })
    }, [stock])

    const convert = (raw) => {
        return raw.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
    }

    return (
        <div className='finances'>
            <h2>{stock} At a Glance...</h2>
            {(Object.keys(fundamentals).length === 0) ? `I couldn't find anything about this company. Are you sure that's the right symbol?` : null}
            {(Object.keys(fundamentals).length > 0) ?
                <p>52-week high ({fundamentals['52WeekHighDate']}): {convert(fundamentals['52WeekHigh'])}</p> : null}
            {(Object.keys(fundamentals).length > 0) ?
                <p>52-week low ({fundamentals['52WeekLowDate']}): {convert(fundamentals['52WeekLow'])}</p> : null}
            {(Object.keys(fundamentals).length > 0) ?
                <p>52-week return: {convert(fundamentals['52WeekPriceReturnDaily'])}</p> : null}
            {(Object.keys(fundamentals).length > 0) ?
                <p>10-day average trading volume: {fundamentals['10DayAverageTradingVolume']}M</p> : null}
            {(Object.keys(fundamentals).length > 0) ?
                <p>Market Cap: {convert(fundamentals['marketCapitalization'])}M</p> : null}
        </div>
    )
}