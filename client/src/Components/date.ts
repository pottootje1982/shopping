function pad(num: number, size: number) {
  const str = num.toString()
  return str.padStart(size, '0')
}

export default function (date?: Date) {
  date = date || new Date()
  const month = pad(date.getMonth() + 1, 2)
  const day = pad(date.getDate(), 2)
  return `${date.getFullYear()}-${month}-${day} ${date.toLocaleTimeString(
    'en-GB'
  )}`
}
