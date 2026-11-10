import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { MyTableCardSkeleton } from './MyTableCardSkeleton'

describe('MyTableCardSkeleton', () => {
  it('happy : affiche deux blocs animés', () => {
    const { container } = render(<MyTableCardSkeleton />)

    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(2)
  })

  it('happy : garde le style de carte blanche', () => {
    const { container } = render(<MyTableCardSkeleton />)

    expect(container.firstElementChild).toHaveClass('bg-white')
  })

  it('death : n\'affiche aucun texte', () => {
    const { container } = render(<MyTableCardSkeleton />)

    expect(container.textContent).toBe('')
  })
})
