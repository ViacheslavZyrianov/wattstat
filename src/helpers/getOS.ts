const userAgent = navigator.userAgent.toLowerCase()

export const isAndroid: boolean = userAgent.includes('android')

export const isIOS: boolean =
  userAgent.includes('iphone') ||
  userAgent.includes('ipad') ||
  userAgent.includes('ipod')

export const isDesktop: boolean = !/android|iphone|ipad|ipod|mobile/.test(
  userAgent,
)
