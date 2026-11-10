import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { restaurantApi } from '@/shared/api/restaurant-api'
import { ReservationForm } from './ReservationForm'

vi.mock('@/shared/api/restaurant-api', () => ({
  restaurantApi: {
    reservations: {
      create: vi.fn(),
    },
  },
}))

describe('ReservationForm', () => {
  beforeEach(() => {
    vi.mocked(restaurantApi.reservations.create).mockReset()
  })

  it('happy : affiche les champs de réservation et le bouton de validation', () => {
    renderWithProviders(<ReservationForm />)

    expect(screen.getByRole('heading', { name: 'Réserver une table' })).toBeInTheDocument()
    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre de personnes')).toHaveValue(2)
    expect(screen.getByRole('button', { name: 'Réserver' })).toBeEnabled()
  })

  it('happy : envoie la réservation puis confirme son enregistrement', async () => {
    vi.mocked(restaurantApi.reservations.create).mockResolvedValue({ id: 'r1' })
    renderWithProviders(<ReservationForm />)

    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2099-06-15' } })
    fireEvent.change(screen.getByLabelText("Heure d'arrivée"), { target: { value: '19:00' } })
    fireEvent.change(screen.getByLabelText('Heure de départ'), { target: { value: '21:00' } })
    fireEvent.click(screen.getByRole('button', { name: 'Réserver' }))

    expect(await screen.findByText('Votre réservation est enregistrée.')).toBeInTheDocument()
    await waitFor(() => {
      expect(restaurantApi.reservations.create).toHaveBeenCalledWith(
        expect.objectContaining({ guestCount: 2 }),
      )
    })
  })

  it('death : refuse une heure de départ avant l\'heure d\'arrivée', async () => {
    renderWithProviders(<ReservationForm />)

    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2099-06-15' } })
    fireEvent.change(screen.getByLabelText("Heure d'arrivée"), { target: { value: '21:00' } })
    fireEvent.change(screen.getByLabelText('Heure de départ'), { target: { value: '19:00' } })
    fireEvent.click(screen.getByRole('button', { name: 'Réserver' }))

    expect(await screen.findByText("L'heure de fin doit être après l'heure de début.")).toBeInTheDocument()
    expect(restaurantApi.reservations.create).not.toHaveBeenCalled()
  })
})
