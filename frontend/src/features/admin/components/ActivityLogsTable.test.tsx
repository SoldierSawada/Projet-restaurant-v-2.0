import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import type { ActivityLogPage } from '@/shared/types/restaurant'
import { ActivityLogsTable } from './ActivityLogsTable'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    admin: {
      logs: vi.fn(),
    },
  },
}))

const logPage: ActivityLogPage = {
  items: [
    {
      id: 'log-1',
      action: 'RESERVATION_CREATED',
      memberId: 'abcdef123456',
      details: 'Table 3, 4 personnes',
      createdAt: '2026-10-25T18:00:00.000Z',
    },
  ],
  total: 1,
  page: 1,
  pageSize: 20,
  totalPages: 1,
}

describe('ActivityLogsTable', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.admin.logs).mockReset()
  })

  it('happy : affiche une ligne par action avec son libellé', async () => {
    vi.mocked(restaurantApi.admin.logs).mockResolvedValue(logPage)
    renderWithProviders(<ActivityLogsTable />, { route: '/admin/journal' })

    expect(await screen.findByText('Réservation créée')).toBeInTheDocument()
    expect(screen.getByText('Table 3, 4 personnes')).toBeInTheDocument()
  })

  it('happy : affiche un identifiant de membre raccourci', async () => {
    vi.mocked(restaurantApi.admin.logs).mockResolvedValue(logPage)
    renderWithProviders(<ActivityLogsTable />, { route: '/admin/journal' })

    expect(await screen.findByText('abcdef12')).toBeInTheDocument()
  })

  it('death : affiche un message quand le journal ne charge pas', async () => {
    vi.mocked(restaurantApi.admin.logs).mockRejectedValue(new Error('réseau'))
    renderWithProviders(<ActivityLogsTable />, { route: '/admin/journal' })

    expect(await screen.findByText('Impossible de charger le journal.')).toBeInTheDocument()
  })
})
