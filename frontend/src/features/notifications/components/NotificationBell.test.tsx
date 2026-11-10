import { act, fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test-utils'
import { useNotificationStore } from '@/features/notifications/notification-store'
import { NotificationBell } from './NotificationBell'

function addTestNotification(title: string) {
  act(() => {
    useNotificationStore.getState().addNotification({
      type: 'DATA_UPDATED',
      title,
      message: 'Message de test',
      createdAt: '2026-10-25T18:00:00.000Z',
    })
  })
}

describe('NotificationBell', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [], toasts: [] })
  })

  it('happy : compte les notifications non lues et les marque comme lues', () => {
    renderWithProviders(<NotificationBell />)
    addTestNotification('Table ouverte')

    fireEvent.click(screen.getByRole('button', { name: 'Notifications, 1 non lue(s)' }))
    fireEvent.click(screen.getByRole('button', { name: 'Marquer comme lu' }))

    expect(screen.getByRole('button', { name: 'Notifications, 0 non lue(s)' })).toBeInTheDocument()
  })

  it('happy : supprime une notification', () => {
    renderWithProviders(<NotificationBell />)
    addTestNotification('Réservation annulée')

    fireEvent.click(screen.getByRole('button', { name: 'Notifications, 1 non lue(s)' }))
    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))

    expect(screen.getByText('Aucune notification.')).toBeInTheDocument()
  })

  it('death : indique "Aucune notification." quand la liste est vide', () => {
    renderWithProviders(<NotificationBell />)

    fireEvent.click(screen.getByRole('button', { name: 'Notifications, 0 non lue(s)' }))

    expect(screen.getByText('Aucune notification.')).toBeInTheDocument()
  })
})
