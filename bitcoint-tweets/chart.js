

export const addChart = async () => {
    const tweets = await d3.csv('bitcoint-tweets/data/tweets.csv')
        .then(data => data.map(d => {
            return {
                date: new Date(d.date),
                tweets: +d.count
            }
        }))
}