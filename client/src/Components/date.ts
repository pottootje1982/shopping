function pad(num: number, size: number) {
  let str = num.toString()
  while (str.length < (size || 2)) {
    str = '0' + num
  }
  return num
}

export default function (date?: Date) {
  date = date || new Date()
  const month = pad(date.getMonth() + 1, 2)
  const day = pad(date.getDate(), 2)
  return `${date.getFullYear()}-${month}-${day} ${date.toLocaleTimeString(
    'en-GB'
  )}`
}
