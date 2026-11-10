import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { ConfirmDialog } from './ConfirmDialog'

const baseProps = {
  title: 'Supprimer l\'article ?',
  description: 'Cette action est irréversible.',
  confirmLabel: 'Supprimer',
}

describe('ConfirmDialog', () => {
  it('happy : affiche le titre et la description quand il est ouvert', () => {
    renderWithProviders(<ConfirmDialog {...baseProps} open onOpenChange={vi.fn()} onConfirm={vi.fn()} />)

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText('Supprimer l\'article ?')).toBeInTheDocument()
    expect(screen.getByText('Cette action est irréversible.')).toBeInTheDocument()
  })

  it('happy : appelle onConfirm quand on confirme', () => {
    const onConfirm = vi.fn()
    renderWithProviders(<ConfirmDialog {...baseProps} open onOpenChange={vi.fn()} onConfirm={onConfirm} />)

    fireEvent.click(screen.getByRole('button', { name: 'Supprimer' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('death : ne confirme pas quand on annule', () => {
    const onConfirm = vi.fn()
    const onOpenChange = vi.fn()
    renderWithProviders(<ConfirmDialog {...baseProps} open onOpenChange={onOpenChange} onConfirm={onConfirm} />)

    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
