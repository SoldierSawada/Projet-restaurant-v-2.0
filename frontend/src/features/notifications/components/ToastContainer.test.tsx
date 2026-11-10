import { act, fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test-utils'
import { useNotificationStore } from '@/features/notifications/notification-store'
import { ToastContainer } from './ToastContainer'

describe('ToastContainer', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [], toasts: [] })
  })

  it('happy : affiche une notification reçue', () => {
    renderWithProviders(<ToastContainer />)

    act(() => {
      useNotificationStore.getState().addNotification({
        type: 'RESERVATION_CONFIRMED',
        title: 'Réservation confirmée',
        message: 'À demain à 19 h.',
        createdAt: '2026-10-25T18:00:00.000Z',
      })
    })

    expect(screen.getByText('Réservation confirmée')).toBeInTheDocument()
  })

  it('happy : retire la notification quand on la ferme', () => {
    renderWithProviders(<ToastContainer />)

    act(() => {
      useNotificationStore.getState().addNotification({
        type: 'TABLE_FERMEE',
        title: 'Table fermée',
        message: 'La table 2 est fermée.',
        createdAt: '2026-10-25T18:00:00.000Z',
      })
    })
    fireEvent.click(screen.getByRole('button', { name: 'Fermer la notification' }))

    expect(screen.queryByText('Table fermée')).not.toBeInTheDocument()
  })

  it('death : n\'affiche aucune zone de statut sans notification', () => {
    renderWithProviders(<ToastContainer />)

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})
