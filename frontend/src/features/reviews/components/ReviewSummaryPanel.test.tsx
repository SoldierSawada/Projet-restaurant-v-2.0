import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReviewSummaryPanel } from './ReviewSummaryPanel'

describe('ReviewSummaryPanel', () => {
  it('happy : affiche la moyenne et le nombre d\'avis', () => {
    render(<ReviewSummaryPanel summary={{ average: 4.5, count: 2, ratingCounts: [0, 0, 0, 1, 1] }} />)

    expect(screen.getByRole('region', { name: 'Résumé des avis' })).toBeInTheDocument()
    expect(screen.getByText('4,5')).toBeInTheDocument()
    expect(screen.getByText('2 avis')).toBeInTheDocument()
  })

  it('happy : affiche les étoiles correspondant à la moyenne', () => {
    render(<ReviewSummaryPanel summary={{ average: 4.5, count: 2, ratingCounts: [0, 0, 0, 1, 1] }} />)

    expect(screen.getByRole('img', { name: 'Note : 4,5 sur 5' })).toBeInTheDocument()
  })

  it('death : affiche un message quand il n\'y a aucun avis', () => {
    render(<ReviewSummaryPanel summary={{ average: null, count: 0, ratingCounts: [0, 0, 0, 0, 0] }} />)

    expect(screen.getByText('Aucun avis pour le moment.')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Aucune note' })).toBeInTheDocument()
  })
})
