import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { useAuthStore } from '@/features/auth/auth-store'
import { ProfileForm } from './ProfileForm'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    members: {
      updateProfile: vi.fn(),
    },
  },
}))

describe('ProfileForm', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.members.updateProfile).mockReset()
    useAuthStore.setState({ token: 'jeton', memberId: 'membre-1' })
  })

  it('happy : affiche le nom actuel et bloque l\'envoi tant qu\'il n\'a pas changé', () => {
    renderWithProviders(<ProfileForm defaultName="Marie" />)

    expect(screen.getByLabelText('Nom affiché')).toHaveValue('Marie')
    expect(screen.getByRole('button', { name: 'Enregistrer le nom' })).toBeDisabled()
  })

  it('happy : enregistre le nouveau nom après modification', async () => {
    vi.mocked(restaurantApi.members.updateProfile).mockResolvedValue({ id: 'membre-1', name: 'Marina' })
    renderWithProviders(<ProfileForm defaultName="Marie" />)

    fireEvent.change(screen.getByLabelText('Nom affiché'), { target: { value: 'Marina' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer le nom' }))

    await waitFor(() => {
      expect(restaurantApi.members.updateProfile).toHaveBeenCalledWith('membre-1', 'Marina')
    })
  })

  it('death : refuse un nom vide', async () => {
    renderWithProviders(<ProfileForm defaultName="Marie" />)

    fireEvent.change(screen.getByLabelText('Nom affiché'), { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer le nom' }))

    expect(await screen.findByText('Le nom est obligatoire.')).toBeInTheDocument()
    expect(restaurantApi.members.updateProfile).not.toHaveBeenCalled()
  })
})
