import { NavLink } from 'react-router-dom'
import { cn } from '@/shared'
import { menuCategories, type MenuCategorySlug } from '@/features/menu/types/menu'

const categoryImages: Record<MenuCategorySlug, { src: string; alt: string }> = {
  boissons: { src: '/images/carte/limonade.png', alt: 'Bouteille de limonade' },
  vins: { src: '/images/carte/vins.png', alt: 'Bouteille et verre de Riesling' },
  entrees: { src: '/images/carte/entrees.png', alt: 'Tarte flambée' },
  plats: { src: '/images/carte/plats.png', alt: 'Choucroute garnie' },
  desserts: { src: '/images/carte/desserts.png', alt: 'Dessert glacé aux biscuits' },
  digestif: { src: '/images/carte/digestif.png', alt: 'Bouteille de Kirschwasser' },
}

export function CarteTabs() {
  return (
    <nav aria-label="Catégories de la carte" className="mx-auto w-full max-w-md px-4">
      <ul className="flex flex-col gap-8">
        {menuCategories.map((category, index) => {
          const image = categoryImages[category.slug]
          const imageOnLeft = index % 2 === 0

          return (
            <li key={category.slug} className="relative">
              <img
                src={image.src}
                alt={image.alt}
                className={cn(
                  'pointer-events-none absolute bottom-0 hidden h-[160px] w-[110px] rounded-xl bg-white object-contain lg:block',
                  imageOnLeft ? '-left-[170px] -rotate-[22deg]' : '-right-[170px] rotate-[22deg]',
                )}
              />
              <NavLink
                to={`/carte/${category.slug}`}
                className={({ isActive }) =>
                  cn(
                    'block w-full rounded-2xl border px-8 py-5 text-center text-[22px] font-medium',
                    isActive
                      ? 'border-[#d9733a] bg-[#d9733a] font-bold text-slate-900'
                      : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-[#2a3550] dark:bg-[#0c1424] dark:text-[#e8ecf5] dark:hover:bg-slate-800',
                  )
                }
              >
                {category.label}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
