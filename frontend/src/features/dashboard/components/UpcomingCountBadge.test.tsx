import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { useAuthStore } from '@/features/auth/auth-store'
import type { Reservation } from '@/shared/types/restaurant'
import { UpcomingCountBadge } from './UpcomingCountBadge'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    members: {
      reservations: vi.fn(),
    },
  },
}))

function makeReservation(id: string): Reservation {
  return {
    id,
    memberId: 'membre-1',
    tableId: 't1',
    reservationDate: '2099-06-15T00:00:00.000Z',
    startTime: '2099-06-15T17:00:00.000Z',
    endTime: '2099-06-15T19:00:00.000Z',
    guestCount: 2,
    status: 'CONFIRMED',
  }
}

describe('UpcomingCountBadge', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.members.reservations).mockReset()
    useAuthStore.setState({ token: 'jeton', memberId: 'membre-1' })
  })

  it('happy : affiche le nombre de réservations à venir', async () => {
    vi.mocked(restaurantApi.members.reservations).mockResolvedValue([makeReservation('r1'), makeReservation('r2')])
    renderWithProviders(<UpcomingCountBadge />)

    expect(await screen.findByText('2')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Réservations à venir' })).toBeInTheDocument()
  })

  it('happy : affiche zéro sans réservation à venir', async () => {
    vi.mocked(restaurantApi.members.reservations).mockResolvedValue([])
    renderWithProviders(<UpcomingCountBadge />)

    expect(await screen.findByText('0')).toBeInTheDocument()
  })

  it('death : n\'affiche pas de faux compteur quand le chargement échoue', async () => {
    vi.mocked(restaurantApi.members.reservations).mockRejectedValue(new Error('réseau'))
    renderWithProviders(<UpcomingCountBadge />)

    await waitFor(() => {
      expect(restaurantApi.members.reservations).toHaveBeenCalledTimes(1)
    })
    expect(screen.getByText('…')).toBeInTheDocument()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
})
