export default function WatchListItem({stock, removeStock, refreshWatchlist}) {
    const remove = () => {
        removeStock(stock.symbol)
    }

    return (
        <div></div>
    )
}