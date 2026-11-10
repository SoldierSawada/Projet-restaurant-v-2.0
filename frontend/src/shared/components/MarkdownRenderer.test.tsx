import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { MarkdownRenderer } from './MarkdownRenderer'

describe('MarkdownRenderer', () => {
  it('happy : rend les titres et les listes en markdown', () => {
    renderWithProviders(<MarkdownRenderer content={'## Histoire\n\n- Choucroute\n- Kugelhopf'} />)

    expect(screen.getByRole('heading', { level: 2, name: 'Histoire' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('happy : ouvre les liens dans un nouvel onglet de façon sécurisée', () => {
    renderWithProviders(<MarkdownRenderer content={'[Carte](https://example.com)'} />)

    const link = screen.getByRole('link', { name: 'Carte' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('death : n\'exécute pas de script inséré dans le texte', () => {
    const { container } = renderWithProviders(<MarkdownRenderer content={'<script>alert(1)</script>'} />)

    expect(container.querySelector('script')).toBeNull()
  })
})
