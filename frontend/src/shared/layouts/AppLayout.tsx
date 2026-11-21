import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { IvyDecoration } from '@/features/site/components/IvyDecoration'
import { SiteHeader } from '@/features/site/components/SiteHeader'
import { isIvyPath } from '@/features/site/lib/ivy-routes'
import { AppErrorBoundary } from '@/shared/components/AppErrorBoundary'
import { PageLoader } from '@/shared/components/PageLoader'
import { ScrollToTopButton } from '@/shared/components/ScrollToTopButton'
import { cn } from '@/shared/lib/cn'

export function AppLayout() {
  const location = useLocation()
  const withIvy = isIvyPath(location.pathname)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-creme text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {withIvy && <IvyDecoration />}
      <SiteHeader />

      <AppErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <div key={location.pathname} className={cn('animate-fade-in', withIvy && 'xl:px-56')}>
            <Outlet />
          </div>
        </Suspense>
      </AppErrorBoundary>

      <ScrollToTopButton />
    </div>
  )
}
