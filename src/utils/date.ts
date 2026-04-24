export const formatDate = (date: string) => {
  const [year, month, day] = date.split('T')[0].split('-')

  const months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ]

  return `${day}, ${months[Number(month) - 1]} ${year}`
}
