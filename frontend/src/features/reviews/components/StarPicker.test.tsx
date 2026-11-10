import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { StarPicker } from './StarPicker'

describe('StarPicker', () => {
  it('happy : marque la note choisie comme active', () => {
    render(<StarPicker value={3} onChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: '3 étoiles' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '4 étoiles' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('happy : transmet la note cliquée', () => {
    const onChange = vi.fn()
    render(<StarPicker value={3} onChange={onChange} />)

    fireEvent.click(screen.getByRole('button', { name: '5 étoiles' }))

    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('death : aucune étoile n\'est active quand aucune note n\'est choisie', () => {
    render(<StarPicker value={0} onChange={vi.fn()} />)

    screen.getAllByRole('button').forEach((button) => {
      expect(button).toHaveAttribute('aria-pressed', 'false')
    })
  })
})
