function setCookie(name, value, expirationDate) {
  name = encodeURIComponent(name)
  value = encodeURIComponent(value)
  let expirationString = ""
  if (expirationDate) {
    expirationDate = new Date(expirationDate * 1000)
    expirationString = `; expires=${expirationDate.toUTCString()}`
  }
  document.cookie = `${name}=${value}${expirationString}`
}

function getCookieAndStore(cookieName) {
  chrome.runtime.sendMessage(
    { name: "getCookie", url: "https://www.ah.nl", cookieName },
    function (response) {
      const { name, value, expirationDate } = response || {}
      if (name && value) {
        setCookie(name, value, expirationDate)
      }
    }
  )
}

getCookieAndStore("ah_token")
getCookieAndStore("ah_token_presumed")

chrome.runtime.onMessage.addListener(function (changeInfo) {
  if (changeInfo.value) {
    window.localStorage.setItem("ah_token", changeInfo.value)
  }
})
