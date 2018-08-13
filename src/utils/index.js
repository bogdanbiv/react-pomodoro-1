import parseMs from 'parse-ms'

export const timeFormatter = milli => {
  const { days, hours, minutes } = parseMs(parseInt(milli, 10))
  let timeString = ''

  if (days) {
    timeString += `${days}d `
  }
  if (hours) {
    timeString += `${hours}h `
  }
  if (minutes) {
    timeString += `${minutes}m `
  }

  return timeString
}

export const id = () =>
  Math.random()
    .toString(36)
    .substr(2, 13)
