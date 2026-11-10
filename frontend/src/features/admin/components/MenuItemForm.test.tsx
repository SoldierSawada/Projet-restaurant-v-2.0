import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { MenuItemForm } from './MenuItemForm'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    admin: {
      createMenuItem: vi.fn(),
    },
  },
}))

describe('MenuItemForm', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.admin.createMenuItem).mockReset()
  })

  it('happy : propose toutes les catégories de la carte', () => {
    renderWithProviders(<MenuItemForm />)

    const select = screen.getByLabelText('Catégorie')
    expect(screen.getByRole('option', { name: 'Plats' })).toBeInTheDocument()
    expect(select).toHaveValue('')
  })

  it('happy : ajoute le produit avec un prix converti en nombre', async () => {
    vi.mocked(restaurantApi.admin.createMenuItem).mockResolvedValue({
      id: 'nouveau',
      title: 'Tarte flambée',
      category: 'entrees',
      price: 9,
      description: 'Crème fraîche et lardons.',
    })
    renderWithProviders(<MenuItemForm />)

    fireEvent.change(screen.getByLabelText('Nom du produit'), { target: { value: 'Tarte flambée' } })
    fireEvent.change(screen.getByLabelText('Catégorie'), { target: { value: 'entrees' } })
    fireEvent.change(screen.getByLabelText('Prix (€)'), { target: { value: '9' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Crème fraîche et lardons.' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter le produit' }))

    await waitFor(() => {
      expect(restaurantApi.admin.createMenuItem).toHaveBeenCalledWith({
        title: 'Tarte flambée',
        category: 'entrees',
        price: 9,
        description: 'Crème fraîche et lardons.',
      })
    })
  })

  it('death : affiche les erreurs et n\'envoie rien quand le formulaire est vide', async () => {
    renderWithProviders(<MenuItemForm />)

    fireEvent.click(screen.getByRole('button', { name: 'Ajouter le produit' }))

    expect(await screen.findByText('Le nom du produit est obligatoire.')).toBeInTheDocument()
    expect(restaurantApi.admin.createMenuItem).not.toHaveBeenCalled()
  })
})
