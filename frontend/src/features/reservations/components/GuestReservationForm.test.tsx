import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { GuestReservationForm } from './GuestReservationForm'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    reservations: {
      createGuest: vi.fn(),
    },
  },
}))

describe('GuestReservationForm', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.reservations.createGuest).mockReset()
  })

  it('happy : affiche le formulaire et un lien vers la connexion', () => {
    renderWithProviders(<GuestReservationForm />)

    expect(screen.getByRole('heading', { name: 'Réserver une table' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Connectez-vous' })).toHaveAttribute('href', '/login')
  })

  it('happy : envoie la réservation puis affiche la confirmation', async () => {
    vi.mocked(restaurantApi.reservations.createGuest).mockResolvedValue({ id: 'r1' })
    renderWithProviders(<GuestReservationForm />)

    fireEvent.change(screen.getByLabelText('Votre nom'), { target: { value: 'Marie Dupont' } })
    fireEvent.change(screen.getByLabelText('Téléphone'), { target: { value: '06 12 34 56 78' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'marie@example.fr' } })
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2099-06-15' } })
    fireEvent.change(screen.getByLabelText("Heure d'arrivée"), { target: { value: '19:00' } })
    fireEvent.change(screen.getByLabelText('Heure de départ'), { target: { value: '21:00' } })
    fireEvent.click(screen.getByRole('button', { name: 'Réserver' }))

    expect(await screen.findByText('Votre table est réservée le 15/06/2099 de 19:00 à 21:00.')).toBeInTheDocument()
    expect(restaurantApi.reservations.createGuest).toHaveBeenCalledWith(
      expect.objectContaining({
        guestName: 'Marie Dupont',
        guestEmail: 'marie@example.fr',
        guestPhone: '06 12 34 56 78',
        guestCount: 2,
      }),
    )
  })

  it('death : refuse l\'envoi sans nom', async () => {
    renderWithProviders(<GuestReservationForm />)

    fireEvent.click(screen.getByRole('button', { name: 'Réserver' }))

    expect(await screen.findByText('Votre nom est obligatoire.')).toBeInTheDocument()
    expect(restaurantApi.reservations.createGuest).not.toHaveBeenCalled()
  })
})
