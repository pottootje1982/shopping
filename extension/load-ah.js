function register() {
  chrome.runtime.sendMessage({ name: "register", tabName: "ah" })
}

register()

chrome.runtime.onMessage.addListener((items, _sender, sendResponse) => {
  if (items) {
    fetch("https://www.ah.nl/common/api/basket/v2/add", {
      headers: { "content-type": "application/json" },
      method: "POST",
      body: JSON.stringify({ items }),
    }).then((response) => {
      const message = response.status === 200 ? "SUCCESS" : "ERROR"
      sendResponse({ message, ...response })
    })
  }
  return true
})
