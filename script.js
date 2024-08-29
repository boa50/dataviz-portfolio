import { appendChartContainer, getChart, getMargin } from "./node_modules/visual-components/index.js"
import { addChart as addBitcoinPricesTweets } from "./bitcoint-tweets/chart.js"

const bitcoinId = appendChartContainer({ idNum: 1, chartTitle: 'Bitcoin Prices and Tweets' })
await new Promise(r => setTimeout(r, 1));

const chartProps = getChart({ id: bitcoinId, margin: getMargin({ right: 64 }) })

addBitcoinPricesTweets(chartProps)