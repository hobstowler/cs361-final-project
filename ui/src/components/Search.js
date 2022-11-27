import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

export default function Search({username, addStock, setWatchNotify, setPortfolioNotify}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [quickQuote, setQuickQuote] = useState('')
    const navigate = useNavigate()

    // sends stock search request to the backend after a half second delay
    useEffect(() => {
        const delay = setTimeout(() => {
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
                    setQuickQuote(`${searchTerm.toUpperCase()} trading at ${data.c.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`)
                })
        }, 500)
        return () => clearTimeout(delay)
    }, [searchTerm])

    // execute a search. takes user to detail page
    const search = (e) => {
        e.preventDefault()
        navigate(`/detail?stock=${searchTerm}`)
        setSearchTerm('')
    }

    // updates the variable associated with the search bar
    const handleChange = (e) => {
        setSearchTerm(e.target.value)
    }

    // adds a stock from search
    const add = (type) => {
        addStock(type, searchTerm)
        setTimeout(() => {
            if (type === 'watchlist') {
                setWatchNotify(true)
            } else if (type === 'portfolio') {
                setPortfolioNotify(true)
            }
        }, 500)
    }

    return (
        <div className='searchWrap'>
            <div className='search'>
                <form onSubmit={search}>
                    <input className='searchEntry' type='text' value={searchTerm} onChange={handleChange} />
                    <input type='submit' value='Search by Symbol' />
                </form>
                <div className='searchText'>
                    {(quickQuote && searchTerm) ? quickQuote : null}
                    {(quickQuote !== '' && quickQuote !== 'Couldn\'t find that one. Try again.' && username) ?
                    <div>
                        <button className='portfolioAdd' onClick={() => add('portfolio')}>Add to Portfolio</button>
                        <button className='watchAdd' onClick={() => add('watchlist')}>Add to Watchlist</button>
                    </div> : null}</div>
            </div>
            <div className='searchInfo'>You can search for a stock by symbol above. Searching brings you to a detailed
                view of the stock and shows much more information about the company you're thinking about investing in
                to help you make an informed decision to invest.</div>
        </div>
    )
}