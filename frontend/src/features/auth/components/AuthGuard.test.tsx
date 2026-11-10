import { act, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/test-utils'
import { useAuthStore } from '@/features/auth/auth-store'
import { AuthGuard } from './AuthGuard'

function renderGuard(route: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<p>Page connexion</p>} />
      <Route element={<AuthGuard />}>
        <Route path="/mon-espace" element={<p>Espace membre</p>} />
      </Route>
    </Routes>,
    { route },
  )
}

describe('AuthGuard', () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, memberId: null })
  })

  it('happy : affiche la page protégée avec un jeton', () => {
    useAuthStore.setState({ token: 'jeton-test', memberId: 'membre-1' })
    renderGuard('/mon-espace')

    expect(screen.getByText('Espace membre')).toBeInTheDocument()
  })

  it('happy : redirige vers la connexion sans jeton', () => {
    renderGuard('/mon-espace')

    expect(screen.getByText('Page connexion')).toBeInTheDocument()
    expect(screen.queryByText('Espace membre')).not.toBeInTheDocument()
  })

  it('death : redirige vers la connexion dès que la session est supprimée', () => {
    useAuthStore.setState({ token: 'jeton-test', memberId: 'membre-1' })
    renderGuard('/mon-espace')

    act(() => {
      useAuthStore.setState({ token: null, memberId: null })
    })

    expect(screen.getByText('Page connexion')).toBeInTheDocument()
  })
})
