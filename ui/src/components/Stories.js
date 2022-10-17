import {useEffect, useState} from "react";
import Story from "./Story";

export default function Stories({stock}) {
    const [stories, setStories] = useState([])

    useEffect(() => {
        getStories()
    }, [stock])

    const getStories = () => {
        let today = new Date()
        let dd = String(today.getDate()).padStart(2, '0')
        let mm = String(today.getMonth()).padStart(2, '0')
        let yyyy = today.getFullYear()
        let endDt = `${yyyy}-${mm}-${dd}`
        console.log(endDt)

        let lastWeek = new Date()
        lastWeek.setDate(today.getDate() - 7)
        dd = String(lastWeek.getDate()).padStart(2, '0')
        mm = String(lastWeek.getMonth()).padStart(2, '0')
        yyyy = lastWeek.getFullYear()
        let startDt = `${yyyy}-${mm}-${dd}`
        console.log(startDt)

        fetch(`/news/${stock}?start_dt=${startDt}&end_dt=${endDt}`, {
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
            <h2>In the News...</h2>
            {(stories.length === 0) ? `I couldn't find any news about this company in the last week. No news is good news, right?`: null}
            {stories.slice(0, 5).map((story) => <Story story={story} />)}
        </div>
    )
}