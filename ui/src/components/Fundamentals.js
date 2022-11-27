import {useEffect, useState} from "react";

export default function Fundamentals({stock}) {
    const [fundamentals, setFundamentals] = useState({})

    // fetches stock fundamentals when focus stock changes
    useEffect(() => {
        if (stock === undefined || stock === '') {
            return
        }
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

    // convert a float to usd
    const convert = (raw) => {
        return raw.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
    }

    return (
        <div className='finances'>
            <h2>{stock.toUpperCase()} by the Numbers</h2>
            <table>
                <thead></thead>
                <tbody>
                    <tr>
                        {(Object.keys(fundamentals).length === 0) ?
                            <td>`I couldn't find anything about this company. Are you sure that's the right symbol?`</td>
                            : null
                        }
                    </tr>
                    {(Object.keys(fundamentals).length > 0) ?
                        <tr>
                            <td>52-week high ({fundamentals['52WeekHighDate']})</td>
                            <td> {convert(fundamentals['52WeekHigh'])}</td>
                        </tr> : null}
                    {(Object.keys(fundamentals).length > 0) ?
                        <tr>
                            <td>52-week low ({fundamentals['52WeekLowDate']})</td>
                            <td> {convert(fundamentals['52WeekLow'])}</td>
                        </tr> : null}
                    {(Object.keys(fundamentals).length > 0) ?
                        <tr>
                            <td>52-week return</td>
                            <td> {convert(fundamentals['52WeekPriceReturnDaily'])}</td>
                        </tr> : null}
                    {(Object.keys(fundamentals).length > 0) ?
                        <tr>
                            <td>10-day average trading volume</td>
                            <td> {fundamentals['10DayAverageTradingVolume']}M</td>
                        </tr> : null}
                    {(Object.keys(fundamentals).length > 0) ?
                        <tr>
                            <td>Market Cap</td>
                            <td>{convert(fundamentals['marketCapitalization'])}M</td>
                        </tr> : null}
                </tbody>
            </table>

        </div>
    )
}