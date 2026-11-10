import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReviewItem } from '@/shared/types/restaurant'
import { ReviewCard } from './ReviewCard'

const review: ReviewItem = {
  id: 'avis-1',
  authorName: 'Marie',
  rating: 5,
  comment: 'Une choucroute excellente.',
  createdAt: '2026-10-20T19:00:00.000Z',
  updatedAt: '2026-10-20T19:00:00.000Z',
  reply: { text: 'Merci Marie !', repliedAt: '2026-10-21T10:00:00.000Z' },
}

describe('ReviewCard', () => {
  it('happy : affiche l\'auteur, le commentaire et la réponse du restaurant', () => {
    render(<ReviewCard review={review} />)

    expect(screen.getByRole('heading', { name: 'Marie' })).toBeInTheDocument()
    expect(screen.getByText('Une choucroute excellente.')).toBeInTheDocument()
    expect(screen.getByText('Réponse du restaurant')).toBeInTheDocument()
    expect(screen.getByText('Merci Marie !')).toBeInTheDocument()
  })

  it('happy : affiche les actions transmises', () => {
    render(<ReviewCard review={review} actions={<button type="button">Supprimer</button>} />)

    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeInTheDocument()
  })

  it('death : affiche une mention quand l\'avis n\'a pas de commentaire ni de réponse', () => {
    render(<ReviewCard review={{ ...review, comment: '', reply: null }} />)

    expect(screen.getByText('Sans commentaire.')).toBeInTheDocument()
    expect(screen.queryByText('Réponse du restaurant')).not.toBeInTheDocument()
  })
})
