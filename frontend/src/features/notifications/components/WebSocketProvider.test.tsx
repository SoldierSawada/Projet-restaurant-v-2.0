import { act, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test-utils'
import { useAuthStore } from '@/features/auth/auth-store'
import { useNotificationStore } from '@/features/notifications/notification-store'
import { useWebSocket } from '@/shared/hooks/useWebSocket'
import { WebSocketProvider } from './WebSocketProvider'

vi.mock('@/shared/hooks/useWebSocket', () => ({
  useWebSocket: vi.fn(),
}))

function getLastOptions() {
  const options = vi.mocked(useWebSocket).mock.lastCall?.[0]
  if (!options) {
    throw new Error('useWebSocket n\'a pas été appelé')
  }
  return options
}

function renderProvider() {
  return renderWithProviders(
    <WebSocketProvider>
      <p>Contenu</p>
    </WebSocketProvider>,
  )
}

describe('WebSocketProvider', () => {
  beforeEach(() => {
    vi.mocked(useWebSocket).mockClear()
    useAuthStore.setState({ token: null, memberId: null })
    useNotificationStore.setState({ notifications: [], toasts: [] })
  })

  it('happy : ouvre la connexion avec le jeton de session et affiche les enfants', () => {
    useAuthStore.setState({ token: 'jeton-test', memberId: 'membre-1' })
    renderProvider()

    expect(getLastOptions().url).toBe('ws://localhost:3000/restaurant/ws?token=jeton-test')
    expect(screen.getByText('Contenu')).toBeInTheDocument()
  })

  it('happy : ajoute une notification à la réception d\'un message valide', () => {
    renderProvider()

    act(() => {
      getLastOptions().onMessage(
        JSON.stringify({
          type: 'TABLE_OUVERTE',
          title: 'Table disponible',
          message: 'La table 4 est libre.',
          createdAt: '2026-10-25T18:00:00.000Z',
        }),
      )
    })

    const notifications = useNotificationStore.getState().notifications
    expect(notifications).toHaveLength(1)
    expect(notifications[0]).toMatchObject({ title: 'Table disponible', type: 'TABLE_OUVERTE', read: false })
  })

  it('death : ignore un message qui n\'est pas du JSON valide', () => {
    renderProvider()

    act(() => {
      getLastOptions().onMessage('pas du json')
    })

    expect(useNotificationStore.getState().notifications).toHaveLength(0)
  })
})
