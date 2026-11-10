import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test-utils'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('happy : est animé avec la variante texte par défaut', () => {
    const { container } = renderWithProviders(<Skeleton />)

    expect(container.firstChild).toHaveClass('animate-pulse', 'h-4', 'w-full')
  })

  it('happy : applique la variante avatar en cercle et la classe personnalisée', () => {
    const { container } = renderWithProviders(<Skeleton variant="avatar" className="mt-4" />)

    expect(container.firstChild).toHaveClass('h-12', 'w-12', 'rounded-full', 'mt-4')
  })

  it('death : ne contient aucun texte', () => {
    const { container } = renderWithProviders(<Skeleton variant="title" />)

    expect(container.firstChild).toBeEmptyDOMElement()
  })
})
