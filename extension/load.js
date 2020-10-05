function setCookie(name, value, expirationDate) {
  name = encodeURIComponent(name)
  value = encodeURIComponent(value)
  expirationDate = new Date(expirationDate * 1000)
  document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}`
  //console.log(document.cookie)
}

function getCookieAndStore(cookieName) {
  chrome.runtime.sendMessage(
    { name: "getCookie", url: "https://www.ah.nl", cookieName },
    function (response) {
      const { name, value, expirationDate } = response || {}
      if (name && value && expirationDate) {
        setCookie(name, value, expirationDate)
        // console.log(document.cookie)
        // console.log(`Setting ${cookieName} to ${response.value}`)
      } else {
        // console.log(`${cookieName} not found`)
      }
    }
  )
}

getCookieAndStore("ah_token")
getCookieAndStore("ah_token_presumed")

chrome.runtime.onMessage.addListener(function (changeInfo) {
  if (changeInfo.value) {
    window.localStorage.setItem("ah_token", changeInfo.value)
    //console.log(`Setting ah_token to ${changeInfo.value}`)
  }
})
