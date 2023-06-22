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
