import { describe, expect, it } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  it('happy : propose le mode sombre quand le thème est clair', () => {
    renderWithProviders(<ThemeToggle />)

    expect(screen.getByRole('button', { name: 'Passer en mode sombre' })).toBeInTheDocument()
  })

  it('happy : bascule entre le mode clair et le mode sombre', () => {
    renderWithProviders(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button', { name: 'Passer en mode sombre' }))
    expect(screen.getByRole('button', { name: 'Passer en mode clair' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Passer en mode clair' }))
    expect(screen.getByRole('button', { name: 'Passer en mode sombre' })).toBeInTheDocument()
  })

  it('death : ne change pas de thème sans clic', () => {
    renderWithProviders(<ThemeToggle />)

    expect(screen.queryByRole('button', { name: 'Passer en mode clair' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Passer en mode sombre' })).toBeInTheDocument()
  })
})
