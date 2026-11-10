import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { BlogArticleForm } from './BlogArticleForm'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    admin: {
      createBlogArticle: vi.fn(),
    },
  },
}))

describe('BlogArticleForm', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.admin.createBlogArticle).mockReset()
  })

  it('happy : affiche les champs et le bouton de publication', () => {
    renderWithProviders(<BlogArticleForm />)

    expect(screen.getByLabelText('Titre')).toBeInTheDocument()
    expect(screen.getByLabelText('Contenu')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Publier l\'article' })).toBeEnabled()
  })

  it('happy : envoie l\'article une fois tous les champs remplis', async () => {
    vi.mocked(restaurantApi.admin.createBlogArticle).mockResolvedValue({
      id: 'nouvel-article',
      title: 'Titre',
      category: 'Histoire',
      excerpt: 'Résumé',
      author: 'Équipe',
      content: 'Contenu',
      publishedAt: '2026-10-25T10:00:00.000Z',
      views: 0,
    })
    renderWithProviders(<BlogArticleForm />)

    fireEvent.change(screen.getByLabelText('Titre'), { target: { value: 'Titre' } })
    fireEvent.change(screen.getByLabelText('Catégorie'), { target: { value: 'Histoire' } })
    fireEvent.change(screen.getByLabelText('Auteur'), { target: { value: 'Équipe' } })
    fireEvent.change(screen.getByLabelText('Résumé'), { target: { value: 'Résumé' } })
    fireEvent.change(screen.getByLabelText('Contenu'), { target: { value: 'Contenu' } })
    fireEvent.click(screen.getByRole('button', { name: 'Publier l\'article' }))

    await waitFor(() => {
      expect(restaurantApi.admin.createBlogArticle).toHaveBeenCalledWith({
        title: 'Titre',
        category: 'Histoire',
        author: 'Équipe',
        excerpt: 'Résumé',
        content: 'Contenu',
      })
    })
  })

  it('death : affiche les erreurs et n\'envoie rien quand le formulaire est vide', async () => {
    renderWithProviders(<BlogArticleForm />)

    fireEvent.click(screen.getByRole('button', { name: 'Publier l\'article' }))

    expect(await screen.findByText('Le titre est obligatoire.')).toBeInTheDocument()
    expect(restaurantApi.admin.createBlogArticle).not.toHaveBeenCalled()
  })
})
