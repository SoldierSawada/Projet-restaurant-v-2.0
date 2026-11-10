import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('happy : affiche les liens des étapes précédentes', () => {
    renderWithProviders(
      <Breadcrumbs items={[{ label: 'Accueil', to: '/' }, { label: 'Carte', to: '/carte' }, { label: 'Plats' }]} />,
    )

    expect(screen.getByRole('link', { name: 'Accueil' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Carte' })).toHaveAttribute('href', '/carte')
  })

  it('happy : marque le dernier élément comme page courante', () => {
    renderWithProviders(<Breadcrumbs items={[{ label: 'Accueil', to: '/' }, { label: 'Plats' }]} />)

    expect(screen.getByText('Plats')).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Plats' })).not.toBeInTheDocument()
  })

  it('death : n\'affiche aucun élément quand la liste est vide', () => {
    const { container } = renderWithProviders(<Breadcrumbs items={[]} />)

    expect(screen.getByRole('navigation', { name: 'Fil d\'Ariane' })).toBeInTheDocument()
    expect(container.querySelectorAll('li')).toHaveLength(0)
  })
})
