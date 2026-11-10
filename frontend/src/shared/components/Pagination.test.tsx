import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('happy : affiche la page courante et le total', () => {
    renderWithProviders(<Pagination page={2} totalPages={5} onPageChange={vi.fn()} />)

    expect(screen.getByText('Page 2 sur 5')).toBeInTheDocument()
  })

  it('happy : demande la page suivante et précédente au clic', () => {
    const onPageChange = vi.fn()
    renderWithProviders(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />)

    fireEvent.click(screen.getByRole('button', { name: 'Suivant' }))
    expect(onPageChange).toHaveBeenLastCalledWith(3)

    fireEvent.click(screen.getByRole('button', { name: 'Précédent' }))
    expect(onPageChange).toHaveBeenLastCalledWith(1)
  })

  it('death : désactive Précédent sur la première page', () => {
    renderWithProviders(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Précédent' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Suivant' })).toBeEnabled()
  })
})
