import Watchlist from "../components/Watchlist";
import Portfolio from "../components/Portfolio";

export default function Home({username}) {
    return (
        <div className='bodyWrap'>
            <div className='left'>
                {username ? <Portfolio username={username} /> : "Log in to view your portfolio."}
                {username ? <Watchlist username={username} /> : "Log in to view your watch list"}
            </div>
            <div className='right'>
                <h4>This is the high level view.</h4>
                <p>See all of your stocks conveniently grouped into either your Portfolio or your Watchlist on the left.
                 Basic information like price is available on this page. If you'd like a more in-depth view of these stocks,
                click on 'See Detail' to see more.</p>
                <p>Or, if you'd like to get started researching something new, search for a stock by symbol at the top.</p>
            </div>
        </div>
    )
}