export const getRandomColors = (count) => {
  return Array.from({ length: count }, () => {
    const hue = Math.floor(Math.random() * 360)
    const saturation = 60 + Math.random() * 20 // 60–80%
    const lightness = 45 + Math.random() * 15 // 45–60%

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  })
}
