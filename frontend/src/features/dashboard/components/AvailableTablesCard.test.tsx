import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { AvailableTablesCard } from './AvailableTablesCard'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    tables: {
      available: vi.fn(),
    },
  },
}))

describe('AvailableTablesCard', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.tables.available).mockReset()
  })

  it('happy : affiche les tables libres', async () => {
    vi.mocked(restaurantApi.tables.available).mockResolvedValue([
      { id: 't1', number: 4, capacity: 2, location: 'Terrasse', active: true },
    ])
    renderWithProviders(<AvailableTablesCard />)

    expect(await screen.findByText('Table 4 · Terrasse · 2 places')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tables libres ce soir' })).toBeInTheDocument()
  })

  it('happy : affiche un message quand aucune table n\'est libre', async () => {
    vi.mocked(restaurantApi.tables.available).mockResolvedValue([])
    renderWithProviders(<AvailableTablesCard />)

    expect(await screen.findByText('Aucune table libre.')).toBeInTheDocument()
  })

  it('death : affiche un message quand les tables ne chargent pas', async () => {
    vi.mocked(restaurantApi.tables.available).mockRejectedValue(new Error('réseau'))
    renderWithProviders(<AvailableTablesCard />)

    expect(await screen.findByText('Impossible de charger les tables.')).toBeInTheDocument()
  })
})
