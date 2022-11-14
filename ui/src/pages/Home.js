import Watchlist from "../components/Watchlist";
import Portfolio from "../components/Portfolio";

export default function Home({username}) {
    return (
        <div className='bodyWrap'>
            <div className='left'>
                <Watchlist username={username} />
                <Portfolio username={username} />
            </div>
            <div className='middle'>
                <h4>This is the main page.</h4>
                <p>See all of your stocks conveniently grouped into either your Portfolio or your Watchlist on the left.
                 Basic information like price is available on this page. If you'd like a more in-depth view of these stocks,
                click on 'See Detail' to see more.</p>
                <p>Or, if you'd like to get started researching something new, search for a stock by symbol with the search bar and you can add it to your portfolio and/or watch list from the detailed view page.</p>
                <p>And, if you'd rather stick to the high level view because it meets your needs right now, that's ok too.</p>
            </div>
            <div className='right'></div>
        </div>
    )
}