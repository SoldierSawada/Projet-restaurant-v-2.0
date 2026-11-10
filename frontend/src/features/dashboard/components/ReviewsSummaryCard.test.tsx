import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import type { ReviewPage } from '@/shared/types/restaurant'
import { ReviewsSummaryCard } from './ReviewsSummaryCard'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    reviews: {
      list: vi.fn(),
    },
  },
}))

const page: ReviewPage = {
  items: [],
  total: 12,
  page: 1,
  pageSize: 1,
  totalPages: 12,
  summary: { average: 4.5, count: 12, ratingCounts: [0, 0, 1, 4, 7] },
}

describe('ReviewsSummaryCard', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.reviews.list).mockReset()
  })

  it('happy : affiche la note moyenne et le nombre d\'avis', async () => {
    vi.mocked(restaurantApi.reviews.list).mockResolvedValue(page)
    renderWithProviders(<ReviewsSummaryCard />)

    expect(await screen.findByText('4,5')).toBeInTheDocument()
    expect(screen.getByText('12 avis')).toBeInTheDocument()
  })

  it('happy : affiche un tiret quand il n\'y a encore aucun avis', async () => {
    vi.mocked(restaurantApi.reviews.list).mockResolvedValue({
      ...page,
      total: 0,
      totalPages: 0,
      summary: { average: null, count: 0, ratingCounts: [0, 0, 0, 0, 0] },
    })
    renderWithProviders(<ReviewsSummaryCard />)

    expect(await screen.findByText('—')).toBeInTheDocument()
    expect(screen.getByText('0 avis')).toBeInTheDocument()
  })

  it('death : affiche un message quand les avis ne chargent pas', async () => {
    vi.mocked(restaurantApi.reviews.list).mockRejectedValue(new Error('réseau'))
    renderWithProviders(<ReviewsSummaryCard />)

    expect(await screen.findByText('Avis indisponibles.')).toBeInTheDocument()
  })
})
