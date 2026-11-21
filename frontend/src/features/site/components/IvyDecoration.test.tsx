import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { IvyDecoration } from './IvyDecoration'

describe('IvyDecoration', () => {
  it('happy : affiche deux branches décoratives masquées aux lecteurs d\'écran', () => {
    const { container } = render(<IvyDecoration />)

    const branches = container.querySelectorAll('svg[aria-hidden="true"]')
    expect(branches).toHaveLength(2)
    expect(branches[0]).toHaveClass('left-0')
    expect(branches[1]).toHaveClass('right-0')
  })

  it('death : n\'empêche pas les clics sur le contenu', () => {
    const { container } = render(<IvyDecoration />)

    container.querySelectorAll('svg').forEach((svg) => {
      expect(svg).toHaveClass('pointer-events-none')
    })
  })
})
