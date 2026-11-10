import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { AvailableTablesCardSkeleton } from './AvailableTablesCardSkeleton'

describe('AvailableTablesCardSkeleton', () => {
  it('happy : affiche trois blocs animés', () => {
    const { container } = render(<AvailableTablesCardSkeleton />)

    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3)
  })

  it('happy : garde le style de carte blanche', () => {
    const { container } = render(<AvailableTablesCardSkeleton />)

    expect(container.firstElementChild).toHaveClass('bg-white')
  })

  it('death : n\'affiche aucun texte', () => {
    const { container } = render(<AvailableTablesCardSkeleton />)

    expect(container.textContent).toBe('')
  })
})
