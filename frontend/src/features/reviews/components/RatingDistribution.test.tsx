import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { RatingDistribution } from './RatingDistribution'

describe('RatingDistribution', () => {
  it('happy : affiche le nombre d\'avis pour chaque note, de 5 à 1 étoile', () => {
    render(<RatingDistribution ratingCounts={[1, 0, 0, 0, 3]} count={4} />)

    const items = within(screen.getByRole('list', { name: 'Répartition des notes' })).getAllByRole('listitem')
    expect(items).toHaveLength(5)
    expect(items[0]).toHaveTextContent('3 avis')
    expect(items[4]).toHaveTextContent('1 avis')
  })

  it('happy : fait correspondre la largeur de la barre à la part des avis', () => {
    const { container } = render(<RatingDistribution ratingCounts={[1, 0, 0, 0, 3]} count={4} />)

    const bars = container.querySelectorAll('.bg-amber-400')
    expect(bars[0]).toHaveStyle({ width: '75%' })
  })

  it('death : affiche zéro avis et une barre vide quand il n\'y a aucun avis', () => {
    const { container } = render(<RatingDistribution ratingCounts={[0, 0, 0, 0, 0]} count={0} />)

    const items = within(screen.getByRole('list', { name: 'Répartition des notes' })).getAllByRole('listitem')
    items.forEach((item) => {
      expect(item).toHaveTextContent('0 avis')
    })
    expect(container.querySelectorAll('.bg-amber-400')[0]).toHaveStyle({ width: '0%' })
  })
})
