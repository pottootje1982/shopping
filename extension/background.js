function getCookie(name) {
  // eslint-disable-next-line no-useless-escape
  console.log(chrome.cookies)
  const escape = (s) => s.replace(/([.*+?\^${}()|\[\]\/\\])/g, "\\$1")
  const match = document.cookie.match(
    RegExp("(?:^|;\\s*)" + escape(name) + "=([^;]*)")
  )

  return match ? match[1] : null
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled...", chrome.cookies)
})

// listen for sendMessage events
chrome.runtime.onMessage.addListener(
  // our event handler
  function (request, _sender, sendResponse) {
    const { name } = request
    console.log(request)
    if (name === "getCookie") {
      const { cookieName, url } = request
      chrome.cookies.get({ url, name: cookieName }, (e) => sendResponse(e))
      //sendResponse(chrome.cookies.get({ name: "ah_token_presumed" }))
      return true
    }
  }
)
