import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { DashboardErrorFallback } from './DashboardErrorFallback'

describe('DashboardErrorFallback', () => {
  it('happy : affiche le titre et le message de l\'erreur', () => {
    render(<DashboardErrorFallback error={new Error('Serveur indisponible')} resetErrorBoundary={vi.fn()} />)

    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument()
    expect(screen.getByText('Serveur indisponible')).toBeInTheDocument()
  })

  it('happy : relance le chargement au clic sur Réessayer', () => {
    const resetErrorBoundary = vi.fn()
    render(<DashboardErrorFallback error={new Error('Erreur')} resetErrorBoundary={resetErrorBoundary} />)

    fireEvent.click(screen.getByRole('button', { name: 'Réessayer' }))

    expect(resetErrorBoundary).toHaveBeenCalledTimes(1)
  })

  it('death : affiche un message neutre quand l\'erreur n\'est pas une vraie erreur', () => {
    render(<DashboardErrorFallback error="boom" resetErrorBoundary={vi.fn()} />)

    expect(screen.getByText('Erreur inconnue')).toBeInTheDocument()
  })
})
