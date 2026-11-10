import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import type { MenuItem } from '@/features/menu/types/menu'
import { DishCard } from './DishCard'

const dish: MenuItem = {
  id: 'choucroute',
  title: '"Sürkrüt" choucroute garnie',
  category: 'plats',
  price: 19,
  description: 'Cuite au riesling.',
}

describe('DishCard', () => {
  it('happy : affiche le nom du plat et un lien vers sa fiche', () => {
    renderWithProviders(<DishCard dish={dish} />)

    expect(screen.getByRole('heading', { name: '"Sürkrüt" choucroute garnie' })).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/carte/plats/choucroute')
  })

  it('happy : affiche le prix au format euro', () => {
    renderWithProviders(<DishCard dish={dish} />)

    expect(screen.getByText(/19,00/)).toBeInTheDocument()
  })

  it('death : affiche un prix nul sans erreur', () => {
    renderWithProviders(<DishCard dish={{ ...dish, price: 0 }} />)

    expect(screen.getByText(/0,00/)).toBeInTheDocument()
  })
})
