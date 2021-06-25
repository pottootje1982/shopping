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

let tabId

// Answering query from gogetmeals in case ah.nl loaded first
chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  const { name } = request
  if (name === "getCookie") {
    chrome.tabs.getSelected(null, (tab) => {
      tabId = tab.id
    })

    const { cookieName, url } = request
    chrome.cookies.get({ url, name: cookieName }, (e) => sendResponse(e))
    return true
  }
})

// Sending cookies to gogetmeals in case gogetmeals got loaded first
chrome.cookies.onChanged.addListener(function (changeInfo) {
  const { domain, name } = changeInfo.cookie
  if (
    domain &&
    domain.includes("www.ah.nl") &&
    (name === "ah_token" || name === "ah_token_presumed") &&
    tabId
  ) {
    chrome.tabs.sendMessage(tabId, changeInfo.cookie)
  }
})
