import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { Toast } from './Toast'

describe('Toast', () => {
  it('happy : affiche le titre et le message dans une zone de statut', () => {
    renderWithProviders(<Toast title="Réservation confirmée" message="À demain à 19 h." onClose={vi.fn()} />)

    expect(screen.getByRole('status')).toHaveTextContent('Réservation confirmée')
    expect(screen.getByText('À demain à 19 h.')).toBeInTheDocument()
  })

  it('happy : appelle onClose quand on ferme la notification', () => {
    const onClose = vi.fn()
    renderWithProviders(<Toast title="Titre" message="Message" onClose={onClose} />)

    fireEvent.click(screen.getByRole('button', { name: 'Fermer la notification' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('death : n\'appelle pas onClose sans clic', () => {
    const onClose = vi.fn()
    renderWithProviders(<Toast title="Titre" message="Message" onClose={onClose} />)

    expect(onClose).not.toHaveBeenCalled()
  })
})
