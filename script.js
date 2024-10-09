import { appendChartContainer, getChart, getMargin } from "./node_modules/visual-components/index.js"
import { addChart as addBitcoinPricesTweets } from "./bitcoint-tweets/chart.js"
import { addChart as addBrasiliaHumidity, addChartV2 as addBrasiliaHumidityV2 } from "./brasilia-humidity/chart.js"
import { addChart as addAiProjectDuration } from "./ai-projects-duration/chart.js"

const containerAspectRatio = 'aspect-[1280/769]'

const bitcoinId = appendChartContainer({
    idNum: 1,
    chartTitle: 'Bitcoin Prices and Tweets',
    chartSubtitle: 'The number of tweets related to Bitcoin has increased drastically since 2022, and users\' engagement always surges during huge price drops',
    theme: 'darkGradient',
    containerAspectRatio
})

const brasiliaHumidityId = appendChartContainer({
    idNum: 2,
    chartTitle: 'Brasília Without Rain - Humidity Levels',
    chartSubtitle: 'Brasília suffered from a prolonged drought in 2024, with more than <strong>120 days</strong> without rain, the longest in 14 years. It caused humidity levels to decrease to ones similar to a desert.',
    theme: 'darkGradient',
    containerAspectRatio
})

const brasiliaHumidityV2Id = appendChartContainer({
    idNum: 22,
    chartTitle: 'Brasília Without Rain - Humidity Levels',
    chartSubtitle: 'Brasília suffered from a prolonged drought in 2024, with more than <strong>120 days</strong> without rain, the longest in 14 years. It caused humidity levels to decrease to ones similar to a desert.',
    theme: 'light',
    containerAspectRatio
})

const aiDurationId = appendChartContainer({
    idNum: 3,
    chartTitle: 'Time Spent in AI Projects',
    chartSubtitle: '',
    theme: 'light',
    containerAspectRatio
})
await new Promise(r => setTimeout(r, 1));

addBitcoinPricesTweets(
    getChart({ id: bitcoinId, margin: getMargin({ left: 72, right: 64, top: 24 }) }),
    'dark'
)

addBrasiliaHumidity(
    getChart({ id: brasiliaHumidityId, margin: getMargin({ left: 76, right: 12, top: 24 }) }),
    'dark'
)

addBrasiliaHumidityV2(
    getChart({ id: brasiliaHumidityV2Id, margin: getMargin({ left: 76, right: 12, top: 24 }) }),
    'light'
)

addAiProjectDuration(
    getChart({ id: aiDurationId, margin: getMargin({ left: 8, right: 8, top: 8, bottom: 8 }) }),
    'light'
)