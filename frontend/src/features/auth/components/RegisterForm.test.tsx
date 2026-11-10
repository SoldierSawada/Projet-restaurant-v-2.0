import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { RegisterForm } from './RegisterForm'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    members: {
      register: vi.fn(),
    },
  },
}))

function fillForm(values: { name: string; email: string; password: string; confirmPassword: string }) {
  fireEvent.change(screen.getByLabelText('Nom'), { target: { value: values.name } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: values.email } })
  fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: values.password } })
  fireEvent.change(screen.getByLabelText('Confirmer le mot de passe'), { target: { value: values.confirmPassword } })
  fireEvent.click(screen.getByRole('button', { name: 'Créer mon compte' }))
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.members.register).mockReset()
  })

  it('happy : affiche la confirmation après une inscription réussie', async () => {
    vi.mocked(restaurantApi.members.register).mockResolvedValue({ id: 'membre-2' })
    renderWithProviders(<RegisterForm />)

    fillForm({ name: 'Marie', email: 'marie@example.fr', password: 'motdepasse1', confirmPassword: 'motdepasse1' })

    expect(await screen.findByText('Compte créé.')).toBeInTheDocument()
    await waitFor(() => {
      expect(restaurantApi.members.register).toHaveBeenCalledWith({
        name: 'Marie',
        email: 'marie@example.fr',
        password: 'motdepasse1',
      })
    })
  })

  it('happy : affiche les champs du formulaire', () => {
    renderWithProviders(<RegisterForm />)

    expect(screen.getByLabelText('Nom')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmer le mot de passe')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Créer mon compte' })).toBeEnabled()
  })

  it('death : refuse deux mots de passe différents sans appeler l\'API', async () => {
    renderWithProviders(<RegisterForm />)

    fillForm({ name: 'Marie', email: 'marie@example.fr', password: 'motdepasse1', confirmPassword: 'autre-mot' })

    expect(await screen.findByText('Les deux mots de passe ne correspondent pas.')).toBeInTheDocument()
    expect(restaurantApi.members.register).not.toHaveBeenCalled()
  })
})
