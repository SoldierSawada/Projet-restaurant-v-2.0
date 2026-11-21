const ivyPrefixes = ['/carte', '/avis', '/a-propos', '/contact', '/blog', '/reserver']

export function isIvyPath(pathname: string): boolean {
  return ivyPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}
