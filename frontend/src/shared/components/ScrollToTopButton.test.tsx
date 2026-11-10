import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { ScrollToTopButton } from './ScrollToTopButton'

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, configurable: true, writable: true })
}

function scrollPage(value: number) {
  setScrollY(value)
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })
}

describe('ScrollToTopButton', () => {
  afterEach(() => {
    setScrollY(0)
    vi.restoreAllMocks()
  })

  it('happy : est masqué quand la page est en haut', () => {
    setScrollY(0)
    renderWithProviders(<ScrollToTopButton />)

    expect(screen.getByRole('button', { name: 'Remonter en haut' })).toHaveClass('opacity-0', 'pointer-events-none')
  })

  it('happy : devient visible après un défilement et remonte en douceur au clic', () => {
    const scrollTo = vi.fn()
    window.scrollTo = scrollTo
    setScrollY(0)
    renderWithProviders(<ScrollToTopButton />)

    scrollPage(400)
    const button = screen.getByRole('button', { name: 'Remonter en haut' })
    expect(button).toHaveClass('opacity-100')

    fireEvent.click(button)
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('death : reste masqué pour un défilement inférieur à 300 px', () => {
    setScrollY(0)
    renderWithProviders(<ScrollToTopButton />)

    scrollPage(100)

    expect(screen.getByRole('button', { name: 'Remonter en haut' })).toHaveClass('opacity-0')
  })
})
