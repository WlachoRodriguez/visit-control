import { getRandomColors } from './colors'

export const buildBarData = (data) => ({
  labels: data.map((d) => `${d.name} ${d.lastName}`),
  datasets: [
    {
      label: 'Visitas',
      data: data.map((d) => d.count),
      backgroundColor: getRandomColors(1)[0],
    },
  ],
})

export const buildLineData = (data) => {
  const color = getRandomColors(1)[0]
  return {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Visitas por mes',
        data: data.map((d) => d.count),
        borderColor: color.replace('hsl', 'hsla').replace(')', `, ${0.6})`),
        backgroundColor: color,
        fill: false,
      },
    ],
  }
}

export const buildDoughnutData = (data) => ({
  labels: data.map((d) => d.churchName),
  datasets: [
    {
      data: data.map((d) => d.count),
      backgroundColor: getRandomColors(data.length),
    },
  ],
})
