import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import type { BlogArticle } from '@/features/blog/types/article'
import { AdminBlogList } from './AdminBlogList'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    blog: {
      list: vi.fn(),
    },
    admin: {
      deleteBlogArticle: vi.fn(),
    },
  },
}))

const articles: BlogArticle[] = [
  {
    id: 'histoire-winstub',
    title: 'Histoire de la winstub',
    category: 'Histoire',
    excerpt: 'Retour sur les origines.',
    author: 'Équipe',
    content: 'Contenu.',
    publishedAt: '2026-10-12T10:00:00.000Z',
    views: 10,
  },
]

describe('AdminBlogList', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.blog.list).mockReset()
    vi.mocked(restaurantApi.admin.deleteBlogArticle).mockReset()
  })

  it('happy : affiche les articles dans un tableau', async () => {
    vi.mocked(restaurantApi.blog.list).mockResolvedValue(articles)
    renderWithProviders(<AdminBlogList />)

    const table = await screen.findByRole('table', { name: 'Liste des articles du blog' })
    expect(within(table).getByText('Histoire de la winstub')).toBeInTheDocument()
  })

  it('happy : supprime un article après confirmation', async () => {
    vi.mocked(restaurantApi.blog.list).mockResolvedValue(articles)
    vi.mocked(restaurantApi.admin.deleteBlogArticle).mockResolvedValue({ deleted: true })
    renderWithProviders(<AdminBlogList />)

    fireEvent.click(await screen.findByRole('button', { name: 'Supprimer' }))
    const dialog = screen.getByRole('alertdialog')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Supprimer' }))

    await waitFor(() => {

      expect(restaurantApi.admin.deleteBlogArticle).toHaveBeenCalledWith('histoire-winstub')

    })
  })

  it('death : affiche un message quand les articles ne chargent pas', async () => {
    vi.mocked(restaurantApi.blog.list).mockRejectedValue(new Error('réseau'))
    renderWithProviders(<AdminBlogList />)

    expect(await screen.findByText('Impossible de charger les articles.')).toBeInTheDocument()
  })
})
