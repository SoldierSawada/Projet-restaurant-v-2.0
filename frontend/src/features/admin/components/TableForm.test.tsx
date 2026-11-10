import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { TableForm } from './TableForm'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    admin: {
      createTable: vi.fn(),
    },
  },
}))

describe('TableForm', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.admin.createTable).mockReset()
  })

  it('happy : affiche les champs et le bouton d\'ajout', () => {
    renderWithProviders(<TableForm />)

    expect(screen.getByLabelText('Numéro de table')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre de places')).toBeInTheDocument()
    expect(screen.getByLabelText('Lieu')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ajouter la table' })).toBeEnabled()
  })

  it('happy : crée la table avec des nombres et non des chaînes', async () => {
    vi.mocked(restaurantApi.admin.createTable).mockResolvedValue({ id: 'nouvelle' })
    renderWithProviders(<TableForm />)

    fireEvent.change(screen.getByLabelText('Numéro de table'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Nombre de places'), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText('Lieu'), { target: { value: 'Terrasse' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter la table' }))

    await waitFor(() => {
      expect(restaurantApi.admin.createTable).toHaveBeenCalledWith({
        number: 3,
        capacity: 4,
        location: 'Terrasse',
      })
    })
  })

  it('death : affiche les erreurs et n\'envoie rien quand le lieu est vide', async () => {
    renderWithProviders(<TableForm />)

    fireEvent.change(screen.getByLabelText('Numéro de table'), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText('Nombre de places'), { target: { value: '4' } })
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter la table' }))

    expect(await screen.findByText('Le lieu est obligatoire.')).toBeInTheDocument()
    expect(restaurantApi.admin.createTable).not.toHaveBeenCalled()
  })
})
