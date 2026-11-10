import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { HomeHero } from './HomeHero'

describe('HomeHero', () => {
  it('happy : affiche le titre principal de la page d\'accueil', () => {
    renderWithProviders(<HomeHero />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent("Un verre de vin d'Alsace")
  })

  it('happy : propose de réserver et de découvrir la carte', () => {
    renderWithProviders(<HomeHero />)

    expect(screen.getByRole('link', { name: 'Réserver une table' })).toHaveAttribute('href', '/reserver')
    expect(screen.getByRole('link', { name: 'Découvrir la carte' })).toHaveAttribute('href', '/carte')
  })

  it('death : ne propose ni bouton ni lien de connexion', () => {
    renderWithProviders(<HomeHero />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Se connecter' })).not.toBeInTheDocument()
  })
})
