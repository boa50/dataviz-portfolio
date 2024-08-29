import { appendChartContainer } from "./node_modules/visual-components/index.js"
import { addChart as addBitcoinPricesTweets } from "./bitcoint-tweets/chart.js"

appendChartContainer({ idNum: 1, chartTitle: 'Bitcoin Prices and Tweets' })


addBitcoinPricesTweets()