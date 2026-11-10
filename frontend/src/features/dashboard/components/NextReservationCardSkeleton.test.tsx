import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { NextReservationCardSkeleton } from './NextReservationCardSkeleton'

describe('NextReservationCardSkeleton', () => {
  it('happy : affiche trois blocs animés', () => {
    const { container } = render(<NextReservationCardSkeleton />)

    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3)
  })

  it('happy : garde le style de carte blanche', () => {
    const { container } = render(<NextReservationCardSkeleton />)

    expect(container.firstElementChild).toHaveClass('bg-white')
  })

  it('death : n\'affiche aucun texte', () => {
    const { container } = render(<NextReservationCardSkeleton />)

    expect(container.textContent).toBe('')
  })
})
