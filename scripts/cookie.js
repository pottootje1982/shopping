module.exports = {
  getCookie: (cookies, cookieName) => {
    const match = cookies
      .map((c) => c.match(new RegExp(`${cookieName}=([^;]+)`)))
      .find((c) => c)
    if (match) {
      return match[1]
    } else return null
  },
}
