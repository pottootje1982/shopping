export function getCookie(name) {
  // eslint-disable-next-line no-useless-escape
  const escape = (s) => s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1')
  const match = document.cookie.match(
    RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)')
  )

  return match ? match[1] : undefined
}

export function setCookie(name, value, expirationHours) {
  const exdate = new Date()
  exdate.setHours(exdate.getHours() + expirationHours)
  document.cookie =
    encodeURIComponent(name) +
    '=' +
    encodeURIComponent(value) +
    (!expirationHours ? '' : '; expires=' + exdate.toUTCString())
}
