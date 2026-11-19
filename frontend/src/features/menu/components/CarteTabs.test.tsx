import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { CarteTabs } from './CarteTabs'

describe('CarteTabs', () => {
  it('happy : affiche un lien vers chaque catégorie de la carte', () => {
    renderWithProviders(<CarteTabs />, { route: '/carte' })

    const nav = screen.getByRole('navigation', { name: 'Catégories de la carte' })
    expect(within(nav).getAllByRole('link')).toHaveLength(6)
    expect(within(nav).getByRole('link', { name: 'Plats' })).toHaveAttribute('href', '/carte/plats')
    expect(within(nav).getByRole('link', { name: 'Digestif' })).toHaveAttribute('href', '/carte/digestif')
  })

  it('happy : met en évidence la catégorie active', () => {
    renderWithProviders(<CarteTabs />, { route: '/carte/plats' })

    expect(screen.getByRole('link', { name: 'Plats' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Vins' })).not.toHaveAttribute('aria-current')
  })

  it('death : n\'active aucune catégorie sur une route qui n\'en fait pas partie', () => {
    const { container } = renderWithProviders(<CarteTabs />, { route: '/blog' })

    expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(0)
  })
})
