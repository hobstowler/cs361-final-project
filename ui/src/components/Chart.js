import {CanvasJSChart} from 'canvasjs-react-charts'
import {useEffect, useState} from "react";

export default function Chart({symbol}) {
    const [symbolData, setSymbolData] = useState([])
    const [volumeData, setVolumeData] = useState([])
    const [dataOptions, setDataOptions] = useState({})
    const [volumeOptions, setVolumeOptions] = useState({})
    const [startDt, setStartDt] = useState(new Date(new Date().setDate(new Date().getDate() - 30)))
    const [endDt, setEndDt] = useState(new Date())
    const [resolution, setResolution] = useState("D")

    useEffect(() => {
        //console.log(startDt)
        //startDt.setUTCSeconds(1590988249)
        //endDt.setUTCSeconds(1591852249)
        //console.log(startDt)
    }, [])

    useEffect(() => {
        getCandles()
    }, [symbol, startDt, endDt, resolution])

    useEffect(() => {
        buildOptions()
    }, [symbolData])

    useEffect(() => {
        buildVolumeOptions()
    }, [volumeData])

    const getCandles = () => {
        fetch(`/candles?symbol=${symbol}&resolution=${resolution}&start=${Math.floor(startDt.valueOf() / 1000)}&end=${Math.floor(endDt.valueOf() / 1000)}`, {
            method: 'GET'
        })
            .then(async response => {
                const hasJson = response.headers.get('content-type')?.includes('application/json')
                const data = hasJson ? await response.json() : null

                if (!response.ok) {
                    let error = (data && data.error) || response.status
                    return Promise.reject(error)
                }
                let priceData = data[0]
                let volumeData = data[1]

                let dataPoints = []
                for (let i = 0; i < priceData.length; i++) {
                    dataPoints.push({
                        x: new Date(priceData[i].x * 1000),
                        y: priceData[i].y
                    })
                }
                let volumeDataPoints = []
                for (let i = 0; i < volumeData.length; i++) {
                    volumeDataPoints.push({
                        x: new Date(volumeData[i].x * 1000),
                        y: volumeData[i].y / 1000
                    })
                }

                setSymbolData(dataPoints)
                setVolumeData(volumeDataPoints)
            })
    }

    const buildOptions = () => {
        let newOptions = {
            theme: "light1", // "light1", "light2", "dark1", "dark2"
            animationEnabled: true,
            exportEnabled: true,
            zoomEnabled: true,
            title:{
                text: `${symbol.toUpperCase()} Candle Chart`
            },
            axisX: {
                valueFormatString: "DD-MMM"
            },
            axisY: {
                prefix: "$",
                title: "Price (in USD)",
                includeZero: false
            },
            data: [{
                type: "candlestick",
                yValueFormatString: "$###0.00",
                xValueType: "dateTime",
                dataPoints: symbolData
            }]
        }
        setDataOptions(newOptions)
    }

    const buildVolumeOptions = () => {
        let newOptions = {
            theme: "light1", // "light1", "light2", "dark1", "dark2"
            animationEnabled: true,
            exportEnabled: true,
            zoomEnabled: true,
            title:{
                text: `${symbol.toUpperCase()} Volume Chart`
            },
            axisX: {
                valueFormatString: "DD-MMM"
            },
            axisY: {
                title: "Volume (Thousands)",
                includeZero: false
            },
            data: [{
                type: "area",
                yValueFormatString: "$###0.00",
                xValueType: "dateTime",
                dataPoints: volumeData
            }]
        }
        setVolumeOptions(newOptions)
    }

    return (
        <div>
            <div className='priceChart'>
                <CanvasJSChart options={dataOptions} />
            </div>
            <div className='volumeChart'>
                <CanvasJSChart options={volumeOptions} />
            </div>
        </div>
    )
}