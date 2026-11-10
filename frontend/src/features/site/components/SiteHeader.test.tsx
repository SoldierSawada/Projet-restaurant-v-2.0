import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { useAuthStore } from '@/features/auth/auth-store'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { SiteHeader } from './SiteHeader'

vi.mock('@/shared/hooks/usePermissions', () => ({
  usePermissions: vi.fn(),
}))

function mockMember(isAdmin: boolean) {
  vi.mocked(usePermissions).mockReturnValue({
    role: isAdmin ? 'ADMIN' : 'MEMBER',
    isPending: false,
    isAdmin,
    hasRole: (roles) => (isAdmin ? roles.includes('ADMIN') : roles.includes('MEMBER')),
  })
}

describe('SiteHeader', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, memberId: null })
    vi.mocked(usePermissions).mockReset()
  })

  it('happy : affiche le nom de la maison et la navigation principale', () => {
    mockMember(false)
    renderWithProviders(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'La Winstub du Tanneur' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toBeInTheDocument()
  })

  it('happy : propose "Se connecter" aux visiteurs et "Mon espace" aux membres connectés', () => {
    mockMember(false)
    const { unmount } = renderWithProviders(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'Se connecter' })).toHaveAttribute('href', '/login')
    unmount()

    useAuthStore.setState({ token: 'jeton-test', memberId: 'membre-1' })
    renderWithProviders(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'Mon espace' })).toHaveAttribute('href', '/mon-espace')
    expect(screen.queryByRole('link', { name: 'Se connecter' })).not.toBeInTheDocument()
  })

  it('death : n\'affiche pas l\'administration à un membre qui n\'est pas responsable', () => {
    mockMember(false)
    useAuthStore.setState({ token: 'jeton-test', memberId: 'membre-1' })
    renderWithProviders(<SiteHeader />)

    expect(screen.queryByRole('link', { name: 'Administration' })).not.toBeInTheDocument()
  })
})
