import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Watchlist from "../components/Watchlist";
import Portfolio from "../components/Portfolio";
import Fundamentals from "../components/Fundamentals";
import Stories from "../components/Stories";

export default function Detail({username}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const [stock, setStock] = useState(searchParams.get('stock'))

    useEffect(() => {
        setStock(searchParams.get('stock'))
    }, [searchParams])

    return (
        <div className='bodyWrap'>
            <div className='left'>
                <Watchlist username={username} />
                <Portfolio username={username} />
            </div>
            <div className='right'>
                <Fundamentals stock={stock} />
                <Stories stock={stock} />
            </div>
        </div>
    )
}