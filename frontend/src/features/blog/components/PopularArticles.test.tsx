import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import type { BlogArticle } from '@/features/blog/types/article'
import { PopularArticles } from './PopularArticles'

function makeArticle(id: string, title: string, views: number): BlogArticle {
  return {
    id,
    title,
    category: 'Recettes',
    excerpt: '',
    author: 'Équipe',
    content: '',
    publishedAt: '2026-10-12T10:00:00.000Z',
    views,
  }
}

const articles = [
  makeArticle('choucroute', 'La choucroute', 320),
  makeArticle('kougelhopf', 'Le kougelhopf', 210),
]

describe('PopularArticles', () => {
  it('happy : affiche la section "Les plus lus" avec le classement', () => {
    renderWithProviders(<PopularArticles articles={articles} />)

    const section = screen.getByRole('region', { name: 'Les plus lus' })
    const items = within(section).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('La choucroute')
  })

  it('happy : affiche le nombre de lectures de chaque article', () => {
    renderWithProviders(<PopularArticles articles={articles} />)

    expect(screen.getByText('320 lectures')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Le kougelhopf/ })).toHaveAttribute('href', '/blog/kougelhopf')
  })

  it('death : n\'affiche aucun élément quand la liste est vide', () => {
    renderWithProviders(<PopularArticles articles={[]} />)

    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
