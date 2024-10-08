const stages = {
    'Problem Definition': 10,
    'Data Collection': 20,
    'Data Cleaning & Preprocessing': 50,
    'Exploratory Data Analysis (EDA)': 15,
    'Feature Engineering & Selection': 20,
    'Model Selection & Development': 15,
    'Model Evaluation': 10,
    'Model Deployment': 10
}

const getRemaining = notArray =>
    Object.entries(stages)
        .filter(d => !notArray.includes(d[0]))
        .map(d => d[1])
        .reduce((t, c) => t + c, 0)

const notTemp1 = ['Problem Definition']
const notTemp2 = [...notTemp1, 'Data Collection', 'Data Cleaning & Preprocessing', 'Exploratory Data Analysis (EDA)']
const notTemp3 = [...notTemp2, 'Feature Engineering & Selection', 'Model Selection & Development', 'Model Evaluation']

export const data = {
    nodes: [
        { id: 'Total', group: 0 },
        { id: 'temp1', group: -1 },
        { id: 'Problem Definition', group: 1 },
        { id: 'temp2', group: -1 },
        { id: 'Data Collection', group: 2 },
        { id: 'Data Cleaning & Preprocessing', group: 2 },
        { id: 'Exploratory Data Analysis (EDA)', group: 2 },
        { id: 'temp3', group: -1 },
        { id: 'Feature Engineering & Selection', group: 3 },
        { id: 'Model Selection & Development', group: 3 },
        { id: 'Model Evaluation', group: 3 },
        { id: 'Model Deployment', group: 4 },
    ],
    links: [
        getLink('Total', 'temp1', getRemaining(notTemp1)),
        getLink('Total', 'Problem Definition'),
        getLink('temp1', 'temp2', getRemaining(notTemp2)),
        getLink('temp1', 'Data Collection'),
        getLink('temp1', 'Data Cleaning & Preprocessing'),
        getLink('temp1', 'Exploratory Data Analysis (EDA)'),
        getLink('temp2', 'temp3', getRemaining(notTemp3)),
        getLink('temp2', 'Feature Engineering & Selection'),
        getLink('temp2', 'Model Selection & Development'),
        getLink('temp2', 'Model Evaluation'),
        getLink('temp3', 'Model Deployment')
    ]
}

function getLink(source, target, value) {
    return { source, target, value: value !== undefined ? value : stages[target] }
}