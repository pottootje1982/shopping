const tabIds = {}

// Registering AH tab id, that we can use to send an order to
chrome.runtime.onMessage.addListener(function (request) {
  const { name, tabName } = request
  if (name === 'register') {
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, (tabs) => {
      tabIds[tabName] = tabs[0].id
    })
    return true
  }
})

// Cookie listener that will send order from cookie to AH tab (that has tabId)
chrome.cookies.onChanged.addListener(({ cookie, removed } = {}) => {
  const { domain, name, value } = cookie
  if (!removed) {
    if (
      domain &&
      (domain.includes('localhost') || domain.includes('gogetmeals')) &&
      name === 'order'
    ) {
      const order = JSON.parse(value)

      if (tabIds.ah) {
        chrome.tabs.sendMessage(tabIds.ah, order, function (response = {}) {
          const { message } = response
          chrome.tabs.sendMessage(tabIds.shopping, {
            ...response,
            message: message || 'NO_RESPONSE'
          })
        })
      } else if (tabIds.shopping) {
        chrome.tabs.sendMessage(tabIds.shopping, {
          message: 'AH_NOT_LOADED'
        })
      }
    }
  }
  return true
})
