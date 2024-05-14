export function isPathBlocked(pathname: string) {
  const isRootPath = pathname === '/';
  const blockedPaths = document.querySelector('meta[property="x:blocked-paths"]')?.getAttribute('content')?.split(',')
  return isRootPath || (blockedPaths?.includes(pathname) ?? false)
}
