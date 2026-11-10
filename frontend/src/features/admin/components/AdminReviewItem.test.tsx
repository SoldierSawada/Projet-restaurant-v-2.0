import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import type { ReviewItem } from '@/shared/types/restaurant'
import { AdminReviewItem } from './AdminReviewItem'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    admin: {
      deleteReview: vi.fn(),
      deleteReviewReply: vi.fn(),
      replyToReview: vi.fn(),
    },
  },
}))

const review: ReviewItem = {
  id: 'avis-1',
  authorName: 'Marie',
  rating: 5,
  comment: 'Une choucroute excellente.',
  createdAt: '2026-10-20T19:00:00.000Z',
  updatedAt: '2026-10-20T19:00:00.000Z',
  reply: { text: 'Merci Marie !', repliedAt: '2026-10-21T10:00:00.000Z' },
}

describe('AdminReviewItem', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.admin.deleteReview).mockReset()
    vi.mocked(restaurantApi.admin.deleteReviewReply).mockReset()
  })

  it('happy : affiche les actions de suppression de l\'avis et de la réponse', () => {
    renderWithProviders(<AdminReviewItem review={review} />)

    expect(screen.getByRole('button', { name: 'Supprimer l\'avis' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Supprimer la réponse' })).toBeInTheDocument()
  })

  it('happy : supprime l\'avis après confirmation', async () => {
    vi.mocked(restaurantApi.admin.deleteReview).mockResolvedValue({ deleted: true })
    renderWithProviders(<AdminReviewItem review={review} />)

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer l\'avis' }))
    const dialog = screen.getByRole('alertdialog')
    expect(within(dialog).getByText('Supprimer cet avis ?')).toBeInTheDocument()
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => {

      expect(restaurantApi.admin.deleteReview).toHaveBeenCalledWith('avis-1')

    })
  })

  it('death : ne supprime rien quand on annule', () => {
    renderWithProviders(<AdminReviewItem review={review} />)

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer l\'avis' }))
    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))

    expect(restaurantApi.admin.deleteReview).not.toHaveBeenCalled()
  })
})
