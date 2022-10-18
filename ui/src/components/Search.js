import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

export default function Search({username}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [quickQuote, setQuickQuote] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        console.log('ok')
        const delay = setTimeout(() => {
            console.log('yes')
            fetch(`/quote/${searchTerm.toUpperCase()}`, {
                method: 'GET',
                headers: {'content-type': 'application/json'}
            })
                .then(async response => {
                    const hasJson = response.headers.get('content-type')?.includes('application/json')
                    const data = hasJson ? await response.json() : null
                    if (!response.ok) {
                        setQuickQuote('Couldn\'t find that one. Try again.')
                        let error = (data && data.error) || response.status
                        return Promise.reject(error)
                    }
                    console.log(response.status)
                    setQuickQuote(`${searchTerm.toUpperCase()} trading at ${data.c.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`)
                })
        }, 500)
        return () => clearTimeout(delay)
    }, [searchTerm])

    const search = (e) => {
        e.preventDefault()
        navigate(`/detail?stock=${searchTerm}`)
        setSearchTerm('')
    }

    const handleChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const addStockToWatchlist = () => {
        fetch(`/watchlist/${username}/${searchTerm.toUpperCase()}`, {
            method: 'POST'
        })
            .then(async response => {
                const hasJson = response.headers.get('content-type')?.includes('application/json')
                const data = hasJson ? await response.json() : null

                if (!response.ok) {
                    let error = (data && data.error) || response.status
                    return Promise.reject(error)
                }
            })
    }

    const addStockToPortfolio = () => {
        fetch(`/portfolio/${username}/${searchTerm.toUpperCase()}`, {
            method: 'POST'
        })
            .then(async response => {
                const hasJson = response.headers.get('content-type')?.includes('application/json')
                const data = hasJson ? await response.json() : null

                if (!response.ok) {
                    let error = (data && data.error) || response.status
                    return Promise.reject(error)
                }
            })
    }

    return (
        <div className='searchWrap'>
            <div className='search'>
                <form onSubmit={search}>
                    <input className='searchEntry' type='text' value={searchTerm} onChange={handleChange} />
                    <input type='submit' value='Search by Symbol' />
                </form>
                <div>{(quickQuote && searchTerm) ? quickQuote : null}{(quickQuote !== '' && quickQuote !== 'Couldn\'t find that one. Try again.' && username) ?
                    <div><button onClick={addStockToWatchlist}>Add to Watch</button><button onClick={addStockToPortfolio}>Add to Portfolio</button></div> : null}</div>
            </div>
            <div className='searchInfo'>You can search for a stock by symbol above. Searching brings you to a detailed view of the stock and shows much more information about the company you're thinking about investing in to help you make an informed decision to invest.</div>
        </div>
    )
}