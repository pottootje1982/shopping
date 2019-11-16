module.exports = function() {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.toLocaleTimeString(
    "en-GB"
  )}`
}
