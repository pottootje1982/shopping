chrome.runtime.sendMessage(
  { name: "getCookie", url: "https://www.ah.nl", cookieName: "ah_token" },
  function (response) {
    if (response.value) {
      chrome.runtime.sendMessage({
        name: "localStorageSet",
        key: "ah_token",
        value: response.value,
      })
      window.localStorage.setItem("ah_token", response.value)
      console.log(`Setting ah_token to ${response.value}`)
    } else {
      console.log("ah_token not found")
    }
  }
)
