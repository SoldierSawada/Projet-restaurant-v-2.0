import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { MemberOnlyCard } from './MemberOnlyCard'

describe('MemberOnlyCard', () => {
  it('happy : affiche le titre de la carte', () => {
    renderWithProviders(<MemberOnlyCard title="Ma table" />)

    expect(screen.getByRole('heading', { name: 'Ma table' })).toBeInTheDocument()
  })

  it('happy : invite à se connecter avec un lien vers la page de connexion', () => {
    renderWithProviders(<MemberOnlyCard title="Ma table" />)

    expect(screen.getByText('Connectez-vous pour voir cette information.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Se connecter' })).toHaveAttribute('href', '/login')
  })

  it('death : ne propose pas de lien d\'inscription', () => {
    renderWithProviders(<MemberOnlyCard title="Ma table" />)

    expect(screen.queryByRole('link', { name: /inscri/i })).not.toBeInTheDocument()
  })
})
