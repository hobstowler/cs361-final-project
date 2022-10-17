import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Watchlist from "../components/Watchlist";
import Portfolio from "../components/Portfolio";
import Fundamentals from "../components/Fundamentals";
import Stories from "../components/Stories";

export default function Detail({username}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const [stock, setStock] = useState(searchParams.get('stock'))
    const [stories, setStories] = useState([])

    useEffect(() => {
        console.log('change detected')
        setStock(searchParams.get('stock'))
    }, [searchParams])

    return (
        <div>
            <div id='left'>
                <Watchlist username={username} />
                <Portfolio username={username} />
            </div>
            <div id='right'>
                <Fundamentals />
                <Stories />
            </div>
        </div>
    )
}