import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import type { TablePage } from '@/shared/types/restaurant'
import { AdminTablesList } from './AdminTablesList'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    admin: {
      tables: vi.fn(),
      setTableActive: vi.fn(),
    },
  },
}))

const tablePage: TablePage = {
  items: [{ id: 't1', number: 1, capacity: 4, location: 'Salle principale', active: true }],
  total: 1,
  page: 1,
  pageSize: 20,
  totalPages: 1,
}

describe('AdminTablesList', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.admin.tables).mockReset()
    vi.mocked(restaurantApi.admin.setTableActive).mockReset()
  })

  it('happy : affiche les tables avec leur statut', async () => {
    vi.mocked(restaurantApi.admin.tables).mockResolvedValue(tablePage)
    renderWithProviders(<AdminTablesList />, { route: '/admin/tables' })

    expect(await screen.findByText('Table 1')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Désactiver' })).toBeInTheDocument()
  })

  it('happy : désactive une table après confirmation', async () => {
    vi.mocked(restaurantApi.admin.tables).mockResolvedValue(tablePage)
    vi.mocked(restaurantApi.admin.setTableActive).mockResolvedValue({ id: 't1', number: 1, capacity: 4, location: 'Salle principale', active: false })
    renderWithProviders(<AdminTablesList />, { route: '/admin/tables' })

    fireEvent.click(await screen.findByRole('button', { name: 'Désactiver' }))
    const dialog = screen.getByRole('alertdialog')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Désactiver' }))

    await waitFor(() => {

      expect(restaurantApi.admin.setTableActive).toHaveBeenCalledWith('t1', false)

    })
  })

  it('death : affiche un message quand les tables ne chargent pas', async () => {
    vi.mocked(restaurantApi.admin.tables).mockRejectedValue(new Error('réseau'))
    renderWithProviders(<AdminTablesList />, { route: '/admin/tables' })

    expect(await screen.findByText('Impossible de charger les tables.')).toBeInTheDocument()
  })
})
