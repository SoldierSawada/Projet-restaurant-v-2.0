import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/test-utils'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { RoleGuard } from './RoleGuard'

vi.mock('@/shared/hooks/usePermissions', () => ({
  usePermissions: vi.fn(),
}))

function renderGuard(route: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<p>Accueil</p>} />
      <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<p>Administration</p>} />
      </Route>
    </Routes>,
    { route },
  )
}

describe('RoleGuard', () => {
  beforeEach(() => {
    vi.mocked(usePermissions).mockReset()
  })

  it('happy : affiche la page quand le rôle est autorisé', () => {
    vi.mocked(usePermissions).mockReturnValue({
      role: 'ADMIN',
      isPending: false,
      isAdmin: true,
      hasRole: (roles) => roles.includes('ADMIN'),
    })
    renderGuard('/admin')

    expect(screen.getByText('Administration')).toBeInTheDocument()
  })

  it('happy : affiche un message pendant le chargement des droits', () => {
    vi.mocked(usePermissions).mockReturnValue({
      role: null,
      isPending: true,
      isAdmin: false,
      hasRole: () => false,
    })
    renderGuard('/admin')

    expect(screen.getByText('Chargement...')).toBeInTheDocument()
  })

  it('death : redirige vers l\'accueil quand le rôle n\'est pas autorisé', () => {
    vi.mocked(usePermissions).mockReturnValue({
      role: 'MEMBER',
      isPending: false,
      isAdmin: false,
      hasRole: (roles) => roles.includes('MEMBER'),
    })
    renderGuard('/admin')

    expect(screen.getByText('Accueil')).toBeInTheDocument()
    expect(screen.queryByText('Administration')).not.toBeInTheDocument()
  })
})
