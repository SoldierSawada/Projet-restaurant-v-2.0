import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Star } from 'lucide-react'
import { renderWithProviders } from '@/test-utils'
import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('happy : affiche le libellé et la valeur', () => {
    renderWithProviders(<StatCard label="Réservations du jour" value="12" icon={Star} />)

    expect(screen.getByText('Réservations du jour')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('happy : affiche l\'indication complémentaire quand elle est fournie', () => {
    renderWithProviders(<StatCard label="Tables" value="4/6" hint="Tables ouvertes" icon={Star} />)

    expect(screen.getByText('Tables ouvertes')).toBeInTheDocument()
  })

  it('death : n\'affiche aucune indication quand elle est absente', () => {
    const { container } = renderWithProviders(<StatCard label="Membres" value="30" icon={Star} />)

    expect(container.querySelectorAll('p')).toHaveLength(2)
  })
})
