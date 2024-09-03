export const prepareData = async () =>
    await d3.csv('brasilia-humidity/data/dataset.csv')
        .then(dt => dt.map(d => {
            return {
                ...d,
                humidityMax: +d.humidityMax,
                humidityMed: +d.humidityMed,
                humidityMin: +d.humidityMin
            }
        }))