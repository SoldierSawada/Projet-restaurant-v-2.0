import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { useAuthStore } from '@/features/auth/auth-store'
import type { Reservation } from '@/shared/types/restaurant'
import { NextReservationCard } from './NextReservationCard'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    members: {
      reservations: vi.fn(),
    },
  },
}))

const reservation: Reservation = {
  id: 'r1',
  memberId: 'membre-1',
  tableId: 't1',
  reservationDate: '2099-06-15T00:00:00.000Z',
  startTime: '2099-06-15T17:00:00.000Z',
  endTime: '2099-06-15T19:00:00.000Z',
  guestCount: 4,
  status: 'CONFIRMED',
}

describe('NextReservationCard', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.members.reservations).mockReset()
    useAuthStore.setState({ token: 'jeton', memberId: 'membre-1' })
  })

  it('happy : affiche le nombre de personnes de la prochaine réservation', async () => {
    vi.mocked(restaurantApi.members.reservations).mockResolvedValue([reservation])
    renderWithProviders(<NextReservationCard />)

    expect(await screen.findByText('4 personne(s)')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Prochaine réservation' })).toBeInTheDocument()
  })

  it('happy : indique qu\'il n\'y a aucune réservation à venir', async () => {
    vi.mocked(restaurantApi.members.reservations).mockResolvedValue([])
    renderWithProviders(<NextReservationCard />)

    expect(await screen.findByText('Aucune réservation à venir.')).toBeInTheDocument()
  })

  it('death : affiche un message quand les réservations ne chargent pas', async () => {
    vi.mocked(restaurantApi.members.reservations).mockRejectedValue(new Error('réseau'))
    renderWithProviders(<NextReservationCard />)

    expect(await screen.findByText('Impossible de charger vos réservations.')).toBeInTheDocument()
  })
})
