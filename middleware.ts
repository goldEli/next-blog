import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import siteMetadata from './data/siteMetadata'

const { fallbackLanguage, languages } = siteMetadata
acceptLanguage.languages(languages)

const publicFile = /\.(.*)$/
const excludeFile = []

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest).*)']
}

function getLanguage(req: NextRequest) {
    // pathname
    const pathname = req.nextUrl.pathname
    let language = pathname.split('/')[1]
    if (!language || !languages.includes(language)) {
        language = fallbackLanguage
    }
    return language
}

function getLocale(req: NextRequest) { 
  let language = getLanguage(req)
  if (!language) language = fallbackLanguage
  return language
 }
 
export function middleware(request) {
  const { pathname } = request.nextUrl

  // 判断路径中是否存在支持的语言
  const filtedLanguage = languages.filter((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (filtedLanguage.length > 0) {
    if (filtedLanguage[0] === fallbackLanguage) {
      // /zh/xxx 重定向到 `/xxx`
      const url = pathname.replace(`/${fallbackLanguage}`, '');
      return NextResponse.redirect(new URL(url ? url : '/', request.url))
    }
    // 其他跳过
    return
  }

  // 如果是 public 文件，不重定向
  if (publicFile.test(pathname) && excludeFile.indexOf(pathname.substr(1)) == -1) return
 
  // 获取匹配的 locale
  const locale = getLocale(request)
  console.log(locale)
  request.nextUrl.pathname = `/${locale}${pathname}`

  // 默认语言不重定向
  if (locale == fallbackLanguage) {
    return NextResponse.rewrite(request.nextUrl)
  }
  // 重定向，如 /products 重定向到 /en/products
  return Response.redirect(request.nextUrl)
}
