import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { useAuthStore } from '@/features/auth/auth-store'
import { PasswordForm } from './PasswordForm'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    members: {
      changePassword: vi.fn(),
      updateProfile: vi.fn(),
    },
  },
}))

describe('PasswordForm', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.members.changePassword).mockReset()
    useAuthStore.setState({ token: 'jeton', memberId: 'membre-1' })
  })

  it('happy : affiche les trois champs de mot de passe', () => {
    renderWithProviders(<PasswordForm />)

    expect(screen.getByLabelText('Mot de passe actuel')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Nouveau mot de passe')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Confirmer le nouveau mot de passe')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Modifier le mot de passe' })).toBeInTheDocument()
  })

  it('happy : envoie le changement puis vide les champs', async () => {
    vi.mocked(restaurantApi.members.changePassword).mockResolvedValue({ changed: true })
    renderWithProviders(<PasswordForm />)

    fireEvent.change(screen.getByLabelText('Mot de passe actuel'), { target: { value: 'ancien-mdp' } })
    fireEvent.change(screen.getByLabelText('Nouveau mot de passe'), { target: { value: 'nouveau-mdp-123' } })
    fireEvent.change(screen.getByLabelText('Confirmer le nouveau mot de passe'), {
      target: { value: 'nouveau-mdp-123' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le mot de passe' }))

    await waitFor(() => {
      expect(restaurantApi.members.changePassword).toHaveBeenCalledWith('membre-1', {
        currentPassword: 'ancien-mdp',
        newPassword: 'nouveau-mdp-123',
      })
    })
    await waitFor(() => {
      expect(screen.getByLabelText('Mot de passe actuel')).toHaveValue('')
    })
  })

  it('death : refuse l\'envoi quand la confirmation ne correspond pas', async () => {
    renderWithProviders(<PasswordForm />)

    fireEvent.change(screen.getByLabelText('Mot de passe actuel'), { target: { value: 'ancien-mdp' } })
    fireEvent.change(screen.getByLabelText('Nouveau mot de passe'), { target: { value: 'nouveau-mdp-123' } })
    fireEvent.change(screen.getByLabelText('Confirmer le nouveau mot de passe'), { target: { value: 'autre-mdp-456' } })
    fireEvent.click(screen.getByRole('button', { name: 'Modifier le mot de passe' }))

    expect(await screen.findByText('Les deux mots de passe ne correspondent pas.')).toBeInTheDocument()
    expect(restaurantApi.members.changePassword).not.toHaveBeenCalled()
  })
})
