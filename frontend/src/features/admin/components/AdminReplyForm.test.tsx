import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { AdminReplyForm } from './AdminReplyForm'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    admin: {
      replyToReview: vi.fn(),
    },
  },
}))

describe('AdminReplyForm', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.admin.replyToReview).mockReset()
  })

  it('happy : affiche la réponse existante dans le champ', () => {
    renderWithProviders(<AdminReplyForm reviewId="avis-1" initialText="Merci pour votre avis." />)

    expect(screen.getByLabelText('Réponse du restaurant')).toHaveValue('Merci pour votre avis.')
  })

  it('happy : enregistre la réponse et confirme', async () => {
    vi.mocked(restaurantApi.admin.replyToReview).mockResolvedValue({ replied: true })
    renderWithProviders(<AdminReplyForm reviewId="avis-1" initialText="" />)

    fireEvent.change(screen.getByLabelText('Réponse du restaurant'), {
      target: { value: 'Merci beaucoup pour votre retour, à bientôt.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer la réponse' }))

    expect(await screen.findByText('Réponse enregistrée.')).toBeInTheDocument()
    await waitFor(() => {
      expect(restaurantApi.admin.replyToReview).toHaveBeenCalledWith(
        'avis-1',
        'Merci beaucoup pour votre retour, à bientôt.',
      )
    })
  })

  it('death : affiche une erreur quand l\'enregistrement échoue', async () => {
    vi.mocked(restaurantApi.admin.replyToReview).mockRejectedValue(new Error('réseau'))
    const { container } = renderWithProviders(<AdminReplyForm reviewId="avis-1" initialText="Texte" />)

    fireEvent.click(screen.getByRole('button', { name: 'Enregistrer la réponse' }))

    await waitFor(() => {
      expect(container.querySelector('p.text-red-600')).toBeInTheDocument()
    })
    expect(screen.queryByText('Réponse enregistrée.')).not.toBeInTheDocument()
  })
})
