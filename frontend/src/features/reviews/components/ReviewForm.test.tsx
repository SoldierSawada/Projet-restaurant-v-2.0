import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { useAuthStore } from '@/features/auth/auth-store'
import { ReviewForm } from './ReviewForm'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    reviews: {
      mine: vi.fn(),
      submit: vi.fn(),
    },
  },
}))

describe('ReviewForm', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.reviews.mine).mockReset()
    vi.mocked(restaurantApi.reviews.submit).mockReset()
    useAuthStore.setState({ token: 'jeton', memberId: 'membre-1' })
  })

  it('happy : propose de donner son avis et bloque l\'envoi tant qu\'aucune note n\'est choisie', async () => {
    vi.mocked(restaurantApi.reviews.mine).mockResolvedValue(null)
    renderWithProviders(<ReviewForm />)

    expect(screen.getByRole('heading', { name: 'Donner mon avis' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Publier mon avis' })).toBeDisabled()
  })

  it('happy : envoie la note et le commentaire puis confirme la publication', async () => {
    vi.mocked(restaurantApi.reviews.mine).mockResolvedValue(null)
    vi.mocked(restaurantApi.reviews.submit).mockResolvedValue({ id: 'avis-1', created: true })
    renderWithProviders(<ReviewForm />)

    fireEvent.click(screen.getByRole('button', { name: '4 étoiles' }))
    fireEvent.change(screen.getByLabelText('Commentaire (facultatif, 500 caractères max.)'), {
      target: { value: 'Très bon accueil.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Publier mon avis' }))

    expect(await screen.findByText('Merci, votre avis est publié.')).toBeInTheDocument()
    expect(restaurantApi.reviews.submit).toHaveBeenCalledWith({ rating: 4, comment: 'Très bon accueil.' })
  })

  it('death : affiche le message d\'erreur quand l\'envoi échoue', async () => {
    vi.mocked(restaurantApi.reviews.mine).mockResolvedValue(null)
    vi.mocked(restaurantApi.reviews.submit).mockRejectedValue(new Error('réseau'))
    renderWithProviders(<ReviewForm />)

    fireEvent.click(screen.getByRole('button', { name: '3 étoiles' }))
    fireEvent.click(screen.getByRole('button', { name: 'Publier mon avis' }))

    await waitFor(() => {
      expect(screen.getByText('Impossible de joindre le serveur.')).toBeInTheDocument()
    })
    expect(screen.queryByText('Merci, votre avis est publié.')).not.toBeInTheDocument()
  })
})
