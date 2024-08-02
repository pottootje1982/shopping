export function getCookie(name: string) {
  // eslint-disable-next-line no-useless-escape
  const escape = (s: string) => s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1')
  const match = document.cookie.match(
    RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)')
  )

  return match ? match[1] : undefined
}

export function setCookie(name: string, value: any, expirationHours: number) {
  const exdate = new Date()
  exdate.setHours(exdate.getHours() + expirationHours)
  document.cookie =
    encodeURIComponent(name) +
    '=' +
    encodeURIComponent(value) +
    (!expirationHours ? '' : '; expires=' + exdate.toUTCString())
}
