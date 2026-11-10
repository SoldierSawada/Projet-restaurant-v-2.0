import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { AppErrorBoundary } from './AppErrorBoundary'

function Unstable({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Erreur de test')
  }
  return <p>Contenu stable</p>
}

describe('AppErrorBoundary', () => {
  it('happy : affiche les enfants quand aucune erreur ne survient', () => {
    renderWithProviders(
      <AppErrorBoundary>
        <p>Page normale</p>
      </AppErrorBoundary>,
    )

    expect(screen.getByText('Page normale')).toBeInTheDocument()
  })

  it('happy : n\'affiche aucune alerte quand tout fonctionne', () => {
    renderWithProviders(
      <AppErrorBoundary>
        <p>Premier bloc</p>
        <p>Second bloc</p>
      </AppErrorBoundary>,
    )

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText('Second bloc')).toBeInTheDocument()
  })

  it('death : affiche le message d\'erreur puis réessaie après clic', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    function Wrapper() {
      const [shouldThrow, setShouldThrow] = useState(true)
      return (
        <>
          <button type="button" onClick={() => setShouldThrow(false)}>
            Corriger
          </button>
          <AppErrorBoundary>
            <Unstable shouldThrow={shouldThrow} />
          </AppErrorBoundary>
        </>
      )
    }

    renderWithProviders(<Wrapper />)

    expect(screen.getByRole('alert')).toHaveTextContent('Une erreur inattendue est survenue.')

    fireEvent.click(screen.getByRole('button', { name: 'Corriger' }))
    fireEvent.click(screen.getByRole('button', { name: 'Réessayer' }))

    expect(screen.getByText('Contenu stable')).toBeInTheDocument()
    vi.restoreAllMocks()
  })
})
