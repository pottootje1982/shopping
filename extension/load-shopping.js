function register() {
  chrome.runtime.sendMessage({ name: 'register', tabName: 'shopping' })
}

register()

document.cookie = 'HAS_SHOPPING_EXTENSION=1'

chrome.runtime.onMessage.addListener((payload) => {
  const { message } = payload
  if (
    (message === 'AH_NOT_LOADED' || message === 'NO_RESPONSE') &&
    window.confirm(
      'You need to have Albert Heijn page open. Press ok to open the page in a new window'
    )
  )
    window.open('https://www.ah.nl', '_blank')
  else if (message === 'SUCCESS') {
    const message = `All products were successfully ordered!`
    alert(message)
  }
  return true
})
