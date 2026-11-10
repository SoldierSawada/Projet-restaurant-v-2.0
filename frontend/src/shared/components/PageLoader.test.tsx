import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { PageLoader } from './PageLoader'

describe('PageLoader', () => {
  it('happy : annonce le chargement aux lecteurs d\'écran', () => {
    renderWithProviders(<PageLoader />)

    expect(screen.getByRole('status')).toHaveTextContent('Chargement de la page...')
  })

  it('happy : affiche un indicateur animé', () => {
    const { container } = renderWithProviders(<PageLoader />)

    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('death : n\'affiche aucun bouton pendant le chargement', () => {
    renderWithProviders(<PageLoader />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
