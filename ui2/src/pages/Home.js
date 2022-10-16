import Watchlist from "../components/Watchlist";
import Portfolio from "../components/Portfolio";

export default function Home({username}) {
    return (
        <div>
            {username ? <Portfolio username={username} /> : "Log in to view your portfolio."}
            {username ? <Watchlist username={username} /> : "Log in to view your watch list"}
        </div>
    )
}