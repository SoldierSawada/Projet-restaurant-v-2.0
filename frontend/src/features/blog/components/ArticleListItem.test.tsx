import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import type { BlogArticle } from '@/features/blog/types/article'
import { ArticleListItem } from './ArticleListItem'

const article: BlogArticle = {
  id: 'histoire-winstub',
  title: 'Histoire de la winstub',
  category: 'Histoire',
  excerpt: 'Retour sur les origines de la maison.',
  author: 'Équipe',
  content: 'Un paragraphe de contenu.',
  publishedAt: '2026-10-12T10:00:00.000Z',
  views: 120,
}

describe('ArticleListItem', () => {
  it('happy : affiche le titre, le résumé et un lien vers l\'article', () => {
    renderWithProviders(<ArticleListItem article={article} />)

    expect(screen.getByRole('heading', { name: 'Histoire de la winstub' })).toBeInTheDocument()
    expect(screen.getByText('Retour sur les origines de la maison.')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/histoire-winstub')
  })

  it('happy : affiche le temps de lecture estimé', () => {
    renderWithProviders(<ArticleListItem article={article} />)

    expect(screen.getByText(/min de lecture/)).toBeInTheDocument()
  })

  it('death : reste utilisable quand le résumé est vide', () => {
    renderWithProviders(<ArticleListItem article={{ ...article, excerpt: '' }} />)

    expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/histoire-winstub')
    expect(screen.getByRole('heading', { name: 'Histoire de la winstub' })).toBeInTheDocument()
  })
})
