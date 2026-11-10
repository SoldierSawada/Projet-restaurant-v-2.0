import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import type { MenuItem } from '@/features/menu/types/menu'
import { HomeDishes } from './HomeDishes'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    menu: {
      list: vi.fn(),
    },
  },
}))

const menuItems: MenuItem[] = [
  { id: 'e1', title: 'Salade de saison', category: 'entrees', price: 9, description: 'Légumes du marché.' },
  { id: 'p1', title: 'Choucroute garnie', category: 'plats', price: 19, description: 'Cuite au riesling.' },
  { id: 'd1', title: 'Tarte aux myrtilles', category: 'desserts', price: 7.5, description: 'Maison.' },
]

describe('HomeDishes', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.menu.list).mockReset()
  })

  it('happy : affiche une entrée, un plat et un dessert avec leur prix', async () => {
    vi.mocked(restaurantApi.menu.list).mockResolvedValue(menuItems)
    renderWithProviders(<HomeDishes />)

    expect(await screen.findByRole('heading', { name: 'Choucroute garnie' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Salade de saison' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tarte aux myrtilles' })).toBeInTheDocument()
    expect(screen.getByText(/19,00/)).toBeInTheDocument()
  })

  it('happy : mène chaque plat vers sa fiche dans la carte', async () => {
    vi.mocked(restaurantApi.menu.list).mockResolvedValue(menuItems)
    renderWithProviders(<HomeDishes />)

    const link = await screen.findByRole('link', { name: /Choucroute garnie/ })
    expect(link).toHaveAttribute('href', '/carte/plats/p1')
  })

  it('death : affiche un message quand la carte ne charge pas', async () => {
    vi.mocked(restaurantApi.menu.list).mockRejectedValue(new Error('réseau'))
    renderWithProviders(<HomeDishes />)

    expect(await screen.findByText('Impossible de charger la carte.')).toBeInTheDocument()
  })
})
