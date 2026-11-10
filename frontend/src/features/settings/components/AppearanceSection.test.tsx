import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { AppearanceSection } from './AppearanceSection'

describe('AppearanceSection', () => {
  it('happy : propose le thème clair et le thème sombre', () => {
    render(<AppearanceSection />)

    expect(screen.getByRole('radio', { name: 'Clair' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Sombre' })).toBeInTheDocument()
  })

  it('happy : sélectionne le thème sombre au clic', () => {
    render(<AppearanceSection />)

    fireEvent.click(screen.getByRole('radio', { name: 'Sombre' }))

    expect(screen.getByRole('radio', { name: 'Sombre' })).toBeChecked()
  })

  it('death : ne garde qu\'un seul thème sélectionné à la fois', () => {
    render(<AppearanceSection />)

    fireEvent.click(screen.getByRole('radio', { name: 'Sombre' }))
    fireEvent.click(screen.getByRole('radio', { name: 'Clair' }))

    expect(screen.getByRole('radio', { name: 'Clair' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Sombre' })).not.toBeChecked()
  })
})
