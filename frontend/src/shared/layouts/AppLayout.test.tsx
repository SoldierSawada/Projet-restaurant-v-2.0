import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/test-utils'
import { AppLayout } from './AppLayout'

vi.mock('@/features/site/components/SiteHeader', async () => {
  const { createElement } = await import('react')
  return {
    SiteHeader: () => createElement('header', null, 'En-tête de test'),
  }
})

function Broken(): never {
  throw new Error('Erreur de test')
}

function renderLayout(pageElement: ReactNode) {
  return renderWithProviders(
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={pageElement} />
      </Route>
    </Routes>,
    { route: '/' },
  )
}

describe('AppLayout', () => {
  it('happy : affiche l\'en-tête et la page demandée', () => {
    renderLayout(<p>Page d'accueil</p>)

    expect(screen.getByText('En-tête de test')).toBeInTheDocument()
    expect(screen.getByText('Page d\'accueil')).toBeInTheDocument()
  })

  it('happy : affiche le bouton pour remonter en haut de page', () => {
    renderLayout(<p>Page d'accueil</p>)

    expect(screen.getByRole('button', { name: 'Remonter en haut' })).toBeInTheDocument()
  })

  it('death : affiche un message d\'erreur si la page plante, sans casser l\'en-tête', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    renderLayout(<Broken />)

    expect(screen.getByRole('alert')).toHaveTextContent('Une erreur inattendue est survenue.')
    expect(screen.getByText('En-tête de test')).toBeInTheDocument()
    vi.restoreAllMocks()
  })
})
