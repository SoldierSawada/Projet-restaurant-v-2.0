import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/test-utils'
import { CartePage } from './CartePage'

function renderCarte(route: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/carte" element={<CartePage />}>
        <Route index element={null} />
        <Route path=":category" element={<p>Contenu de la catégorie</p>} />
      </Route>
    </Routes>,
    { route },
  )
}

describe('CartePage', () => {
  it('happy : affiche le titre et les onglets sur la page d\'accueil de la carte', () => {
    renderCarte('/carte')

    expect(screen.getByRole('heading', { name: 'Carte' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Catégories de la carte' })).toBeInTheDocument()
  })

  it('happy : n\'affiche pas les onglets sur une page de catégorie', () => {
    renderCarte('/carte/plats')

    expect(screen.getByText('Contenu de la catégorie')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Catégories de la carte' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Carte' })).not.toBeInTheDocument()
  })
})
