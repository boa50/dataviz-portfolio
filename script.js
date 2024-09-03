import { appendChartContainer, getChart, getMargin } from "./node_modules/visual-components/index.js"
import { addChart as addBitcoinPricesTweets } from "./bitcoint-tweets/chart.js"
import { addChart as addBrasiliaHumidity } from "./brasilia-humidity/chart.js"

const bitcoinId = appendChartContainer({
    idNum: 1,
    chartTitle: 'Bitcoin Prices and Tweets',
    chartSubtitle: 'The number of tweets related to Bitcoin has increased drastically since 2022, and users\' engagement always surges during huge price drops',
    theme: 'darkGradient'
})

const brasiliaHumidityId = appendChartContainer({
    idNum: 2,
    chartTitle: 'Brasília Humidity',
    chartSubtitle: 'Brasília has be suffering from a severe drought in 2024, with more than 130 days without raining. It causes the huidity to decrese to levels similar to a desert.',
    theme: 'darkGradient'
})
await new Promise(r => setTimeout(r, 1));

addBitcoinPricesTweets(
    getChart({ id: bitcoinId, margin: getMargin({ left: 72, right: 64, top: 24 }) }),
    'dark'
)

addBrasiliaHumidity(
    getChart({ id: brasiliaHumidityId, margin: getMargin({ left: 76, right: 32, top: 24 }) }),
    'dark'
)