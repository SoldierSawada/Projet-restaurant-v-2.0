import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import type { ReservationDayStat } from '@/shared/types/restaurant'
import { ReservationsChart } from './ReservationsChart'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    admin: {
      reservationStats: vi.fn(),
    },
  },
}))

const stats: ReservationDayStat[] = [
  { date: '2026-10-25', reservations: 7 },
  { date: '2026-10-26', reservations: 3 },
]

describe('ReservationsChart', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.admin.reservationStats).mockReset()
  })

  it('happy : affiche les données de chaque jour au format jour/mois', async () => {
    vi.mocked(restaurantApi.admin.reservationStats).mockResolvedValue(stats)
    renderWithProviders(<ReservationsChart />)

    const table = await screen.findByRole('table')
    expect(within(table).getByText('25/10')).toBeInTheDocument()
    expect(within(table).getByText('7')).toBeInTheDocument()
  })

  it('happy : propose le résumé des données sous forme de tableau', async () => {
    vi.mocked(restaurantApi.admin.reservationStats).mockResolvedValue(stats)
    renderWithProviders(<ReservationsChart />)

    expect(await screen.findByText('Voir les données')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Réservations' })).toBeInTheDocument()
  })

  it('death : affiche un message quand les statistiques ne chargent pas', async () => {
    vi.mocked(restaurantApi.admin.reservationStats).mockRejectedValue(new Error('réseau'))
    renderWithProviders(<ReservationsChart />)

    expect(await screen.findByText('Impossible de charger les statistiques.')).toBeInTheDocument()
  })
})
