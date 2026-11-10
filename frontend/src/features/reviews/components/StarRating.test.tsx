import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StarRating } from './StarRating'

describe('StarRating', () => {
  it('happy : annonce la note avec une virgule et sur 5', () => {
    render(<StarRating value={3.5} />)

    expect(screen.getByRole('img', { name: 'Note : 3,5 sur 5' })).toBeInTheDocument()
  })

  it('happy : remplit la part des étoiles correspondant à la note', () => {
    render(<StarRating value={4} />)

    const rating = screen.getByRole('img', { name: 'Note : 4,0 sur 5' })
    expect(rating.querySelector('.absolute')).toHaveStyle({ width: '80%' })
  })

  it('death : n\'affiche aucune étoile remplie sans note', () => {
    render(<StarRating value={null} />)

    const rating = screen.getByRole('img', { name: 'Aucune note' })
    expect(rating.querySelector('.absolute')).toHaveStyle({ width: '0%' })
  })
})
