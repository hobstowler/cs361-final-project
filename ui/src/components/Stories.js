import {useEffect, useState} from "react";
import Story from "./Story";

export default function Stories({stock}) {
    const [stories, setStories] = useState({})

    useEffect(() => {
        getStories()
    }, [stock])

    const getStories = () => {
        let today = new Date()
        let dd = String(today.getDate()).padStart(2, '0')
        let mm = String(today.getMonth()).padStart(2, '0')
        let yyyy = today.getFullYear()
        let endDt = `${yyyy}-${mm}-${dd}`

        let lastWeek = new Date()
        lastWeek.setDate(today.getDate() - 7)
        dd = String(lastWeek.getDate()).padStart(2, '0')
        mm = String(lastWeek.getMonth()).padStart(2, '0')
        yyyy = lastWeek.getFullYear()
        let startDt = `${yyyy}-${mm}-${dd}`

        fetch(`/news/${stock.stock}?start_dt=${startDt}&end_dt${endDt}`, {
            method: 'GET'
        })
            .then(async response => {
                const hasJson = response.headers.get('content-type')?.includes('application/json')
                const data = hasJson ? await response.json() : null

                if (!response.ok) {
                    let error = (data && data.error) || response.status
                    return Promise.reject(error)
                }
                setStories(data)
            })
    }

    return (
        <div>
            {stories.slice(0, 5).map((story) => <Story story={story} />)}
        </div>
    )
}