import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { useAuthStore } from '@/features/auth/auth-store'
import type { Reservation, Table } from '@/shared/types/restaurant'
import { MyTableCard } from './MyTableCard'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    members: {
      reservations: vi.fn(),
    },
    tables: {
      list: vi.fn(),
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
  guestCount: 2,
  status: 'CONFIRMED',
}

const tables: Table[] = [{ id: 't1', number: 4, capacity: 4, location: 'Terrasse', active: true }]

describe('MyTableCard', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.members.reservations).mockReset()
    vi.mocked(restaurantApi.tables.list).mockReset()
    useAuthStore.setState({ token: 'jeton', memberId: 'membre-1' })
  })

  it('happy : affiche la table de la prochaine réservation', async () => {
    vi.mocked(restaurantApi.members.reservations).mockResolvedValue([reservation])
    vi.mocked(restaurantApi.tables.list).mockResolvedValue(tables)
    renderWithProviders(<MyTableCard />)

    expect(await screen.findByText('Table 4 · Terrasse')).toBeInTheDocument()
  })

  it('happy : indique qu\'aucune table n\'est réservée sans réservation à venir', async () => {
    vi.mocked(restaurantApi.members.reservations).mockResolvedValue([])
    vi.mocked(restaurantApi.tables.list).mockResolvedValue(tables)
    renderWithProviders(<MyTableCard />)

    expect(await screen.findByText('Aucune table réservée.')).toBeInTheDocument()
  })

  it('death : affiche un message quand la table ne charge pas', async () => {
    vi.mocked(restaurantApi.members.reservations).mockRejectedValue(new Error('réseau'))
    vi.mocked(restaurantApi.tables.list).mockResolvedValue(tables)
    renderWithProviders(<MyTableCard />)

    expect(await screen.findByText('Impossible de charger votre table.')).toBeInTheDocument()
  })
})
