import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { useAuthStore } from '@/features/auth/auth-store'
import { LoginForm } from './LoginForm'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    members: {
      login: vi.fn(),
    },
  },
}))

function fillForm(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: password } })
  fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }))
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.members.login).mockReset()
    useAuthStore.setState({ token: null, memberId: null })
  })

  it('happy : envoie les identifiants et enregistre la session en cas de succès', async () => {
    vi.mocked(restaurantApi.members.login).mockResolvedValue({ token: 'jeton-test', memberId: 'membre-1' })
    renderWithProviders(<LoginForm />)

    fillForm('membre@example.fr', 'secret')

    await waitFor(() => {
      expect(restaurantApi.members.login).toHaveBeenCalledWith({
        email: 'membre@example.fr',
        password: 'secret',
      })
    })
    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe('jeton-test')
    })
  })

  it('happy : affiche les champs et le bouton de connexion', () => {
    renderWithProviders(<LoginForm />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeEnabled()
  })

  it('death : affiche un message quand le serveur ne répond pas', async () => {
    vi.mocked(restaurantApi.members.login).mockRejectedValue(new Error('réseau'))
    renderWithProviders(<LoginForm />)

    fillForm('membre@example.fr', 'secret')

    expect(await screen.findByText('Impossible de joindre le serveur.')).toBeInTheDocument()
    expect(useAuthStore.getState().token).toBeNull()
  })
})
