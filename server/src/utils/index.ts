export const isNumeric = (num: any) => !isNaN(num)

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const stringToBoolean = (stringValue: string): boolean => {
  switch (stringValue?.toLowerCase()?.trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true

    case 'false':
    case 'no':
    case '0':
    case null:
    case undefined:
      return false

    default:
      return JSON.parse(stringValue)
  }
}

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  const formattedHours = hours.toString().padStart(2, '0')
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0')

  if (hours === 0) {
    return `${formattedMinutes}:${formattedSeconds}`
  }

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}
