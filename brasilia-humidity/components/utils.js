export const formatHumidity = d => d3.format('.0%')(d / 100)

export const getDaysWithoutRaining = (dt, x) =>
    (new Date(dt) - new Date(x.domain()[0])) / (1000 * 60 * 60 * 24)