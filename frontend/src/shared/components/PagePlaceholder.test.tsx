import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { PagePlaceholder } from './PagePlaceholder'

describe('PagePlaceholder', () => {
  it('happy : affiche le titre en niveau 1', () => {
    renderWithProviders(<PagePlaceholder title="Bientôt disponible" />)

    expect(screen.getByRole('heading', { level: 1, name: 'Bientôt disponible' })).toBeInTheDocument()
  })

  it('happy : affiche le message par défaut', () => {
    renderWithProviders(<PagePlaceholder title="Statistiques" />)

    expect(screen.getByText('Cette page est en cours de préparation.')).toBeInTheDocument()
  })

  it('death : remplace le message par défaut par la description fournie', () => {
    renderWithProviders(<PagePlaceholder title="Statistiques" description="Données à venir." />)

    expect(screen.getByText('Données à venir.')).toBeInTheDocument()
    expect(screen.queryByText('Cette page est en cours de préparation.')).not.toBeInTheDocument()
  })
})
