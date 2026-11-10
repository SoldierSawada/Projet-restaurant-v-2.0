import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import type { MyReview } from '@/shared/types/restaurant'
import { MyReviewCard } from './MyReviewCard'

const review: MyReview = {
  id: 'avis-1',
  rating: 4,
  comment: 'Très bonne choucroute.',
  createdAt: '2026-10-20T19:00:00.000Z',
  updatedAt: '2026-10-20T19:00:00.000Z',
  reply: null,
}

describe('MyReviewCard', () => {
  it('happy : affiche la note, le commentaire et un lien pour le modifier', () => {
    renderWithProviders(<MyReviewCard review={review} />)

    expect(screen.getByRole('img', { name: 'Note : 4,0 sur 5' })).toBeInTheDocument()
    expect(screen.getByText('Très bonne choucroute.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Modifier mon avis' })).toHaveAttribute('href', '/avis')
  })

  it('happy : affiche la réponse du restaurant et la date de modification', () => {
    renderWithProviders(
      <MyReviewCard
        review={{
          ...review,
          updatedAt: '2026-10-22T19:00:00.000Z',
          reply: { text: 'Merci Marie !', repliedAt: '2026-10-21T10:00:00.000Z' },
        }}
      />,
    )

    expect(screen.getByText('Merci Marie !')).toBeInTheDocument()
    expect(screen.getByText(/Réponse du restaurant · 21\/10\/2026/)).toBeInTheDocument()
    expect(screen.getByText(/modifié le/)).toBeInTheDocument()
  })

  it('death : n\'affiche ni réponse ni mention de modification sans ces informations', () => {
    renderWithProviders(<MyReviewCard review={review} />)

    expect(screen.queryByText(/Réponse du restaurant/)).not.toBeInTheDocument()
    expect(screen.queryByText(/modifié le/)).not.toBeInTheDocument()
  })
})
