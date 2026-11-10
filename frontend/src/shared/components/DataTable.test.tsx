import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { DataTable, type Column } from './DataTable'

type Dish = { id: string; name: string; price: string }

const columns: Column<Dish>[] = [
  { key: 'name', header: 'Plat', render: (dish) => dish.name },
  { key: 'price', header: 'Prix', render: (dish) => dish.price, className: 'text-right' },
]

const rows: Dish[] = [
  { id: '1', name: 'Choucroute', price: '19,00 €' },
  { id: '2', name: 'Kugelhopf', price: '6,00 €' },
]

describe('DataTable', () => {
  it('happy : affiche les en-têtes et une ligne par élément', () => {
    renderWithProviders(
      <DataTable caption="Carte" columns={columns} rows={rows} getRowKey={(dish) => dish.id} emptyMessage="Vide" />,
    )

    const table = screen.getByRole('table', { name: 'Carte' })
    expect(within(table).getAllByRole('columnheader')).toHaveLength(2)
    expect(within(table).getAllByRole('row')).toHaveLength(3)
    expect(screen.getByText('Choucroute')).toBeInTheDocument()
  })

  it('happy : applique la classe propre à une colonne', () => {
    renderWithProviders(
      <DataTable caption="Carte" columns={columns} rows={rows} getRowKey={(dish) => dish.id} emptyMessage="Vide" />,
    )

    expect(screen.getByText('6,00 €').closest('td')).toHaveClass('text-right')
  })

  it('death : affiche le message vide quand il n\'y a aucune ligne', () => {
    renderWithProviders(
      <DataTable caption="Carte" columns={columns} rows={[]} getRowKey={(dish) => dish.id} emptyMessage="Aucun plat." />,
    )

    expect(screen.getByText('Aucun plat.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
