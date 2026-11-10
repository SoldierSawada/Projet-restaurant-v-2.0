import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Star } from 'lucide-react'
import { renderWithProviders } from '@/test-utils'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('happy : affiche le titre', () => {
    renderWithProviders(<EmptyState title="Aucune réservation" />)

    expect(screen.getByText('Aucune réservation')).toBeInTheDocument()
  })

  it('happy : affiche la description et l\'icône fournies', () => {
    const { container } = renderWithProviders(
      <EmptyState title="Favoris" description="Revenez plus tard." icon={Star} />,
    )

    expect(screen.getByText('Revenez plus tard.')).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveClass('lucide-star')
  })

  it('death : n\'affiche aucune description quand elle est absente', () => {
    const { container } = renderWithProviders(<EmptyState title="Vide" />)

    expect(container.querySelectorAll('p')).toHaveLength(1)
  })
})
