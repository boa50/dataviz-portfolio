import { appendChartContainer, getChart, getMargin } from "./node_modules/visual-components/index.js"
import { addChart as addBitcoinPricesTweets } from "./bitcoint-tweets/chart.js"

const bitcoinId = appendChartContainer({
    idNum: 1,
    chartTitle: 'Bitcoin Prices and Tweets',
    chartSubtitle: 'The number of tweets related to Bitcoin has increased drastically since 2022, and users\' engagement always surges during huge price drops',
    theme: 'darkGradient'
})
await new Promise(r => setTimeout(r, 1));

const chartProps = getChart({ id: bitcoinId, margin: getMargin({ left: 72, right: 64, top: 24 }) })

addBitcoinPricesTweets(chartProps, 'dark')