import parseMs from 'parse-ms'
import toMilliseconds from '@sindresorhus/to-milliseconds'

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

export const timeParser = humanTime => {
  const timeEntry = humanTime.trim().split(' ')
  const timeFrames = ['d', 'h', 'm']
  const timeObject = {}

  timeFrames.map(
    frame =>
      (timeObject[frame] =
        timeEntry.find(t => t.includes(frame)) || `0${frame}`)
  )

  for (let index in timeObject) {
    const digits = timeObject[index].match(/\d+/) || [0]
    timeObject[index] = parseInt(digits[0], 10)
  }

  return toMilliseconds({
    days: timeObject.d,
    hours: timeObject.h,
    minutes: timeObject.m
  })
}

export const id = () =>
  Math.random()
    .toString(36)
    .substr(2, 13)
