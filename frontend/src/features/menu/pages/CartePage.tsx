import { Outlet, useMatch } from 'react-router-dom'
import { CarteTabs } from '@/features/menu/components/CarteTabs'
import { MarkdownRenderer } from '@/shared'

const homeIntro = `Choisissez une catégorie pour voir les plats.

Chaque plat a sa **fiche détaillée** avec ses ingrédients et son prix.`

export function CartePage() {
  const isHome = useMatch({ path: '/carte', end: true }) !== null

  return (
    <section className="flex flex-col gap-6">
      {isHome && (
        <>
          <h1 className="text-center text-2xl font-bold">Carte</h1>
          <MarkdownRenderer content={homeIntro} className="text-center text-slate-600 dark:text-slate-400" />
          <CarteTabs />
        </>
      )}
      <Outlet />
    </section>
  )
}
