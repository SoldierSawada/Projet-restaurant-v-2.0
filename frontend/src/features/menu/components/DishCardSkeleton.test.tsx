import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test-utils'
import { DishCardSkeleton } from './DishCardSkeleton'

describe('DishCardSkeleton', () => {
  it('happy : affiche deux blocs de chargement', () => {
    const { container } = renderWithProviders(<DishCardSkeleton />)

    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(2)
  })

  it('happy : est animé', () => {
    const { container } = renderWithProviders(<DishCardSkeleton />)

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('death : ne contient aucun texte', () => {
    const { container } = renderWithProviders(<DishCardSkeleton />)

    expect(container).toHaveTextContent('')
  })
})
