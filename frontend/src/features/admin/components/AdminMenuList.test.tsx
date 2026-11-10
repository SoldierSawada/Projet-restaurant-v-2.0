import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import type { MenuItem } from '@/features/menu/types/menu'
import { AdminMenuList } from './AdminMenuList'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    menu: {
      list: vi.fn(),
    },
    admin: {
      deleteMenuItem: vi.fn(),
    },
  },
}))

const items: MenuItem[] = [
  {
    id: 'item-1',
    title: '"Sürkrüt" choucroute garnie',
    category: 'plats',
    price: 19,
    description: 'Cuite au riesling.',
  },
]

describe('AdminMenuList', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.menu.list).mockReset()
    vi.mocked(restaurantApi.admin.deleteMenuItem).mockReset()
  })

  it('happy : affiche les produits avec leur catégorie', async () => {
    vi.mocked(restaurantApi.menu.list).mockResolvedValue(items)
    renderWithProviders(<AdminMenuList />)

    const table = await screen.findByRole('table', { name: 'Liste des produits de la carte' })
    expect(within(table).getByText('"Sürkrüt" choucroute garnie')).toBeInTheDocument()
    expect(within(table).getByText('Plats')).toBeInTheDocument()
  })

  it('happy : supprime un produit après confirmation', async () => {
    vi.mocked(restaurantApi.menu.list).mockResolvedValue(items)
    vi.mocked(restaurantApi.admin.deleteMenuItem).mockResolvedValue({ deleted: true })
    renderWithProviders(<AdminMenuList />)

    fireEvent.click(await screen.findByRole('button', { name: 'Supprimer' }))
    const dialog = screen.getByRole('alertdialog')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => {

      expect(restaurantApi.admin.deleteMenuItem).toHaveBeenCalledWith('item-1')

    })
  })

  it('death : affiche un message quand la carte ne charge pas', async () => {
    vi.mocked(restaurantApi.menu.list).mockRejectedValue(new Error('réseau'))
    renderWithProviders(<AdminMenuList />)

    expect(await screen.findByText('Impossible de charger la carte.')).toBeInTheDocument()
  })
})
