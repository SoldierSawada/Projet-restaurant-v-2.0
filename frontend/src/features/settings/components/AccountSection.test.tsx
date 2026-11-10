import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AccountSection } from './AccountSection'

describe('AccountSection', () => {
  it('happy : affiche l\'adresse email du membre', () => {
    render(<AccountSection email="marie@example.fr" />)

    expect(screen.getByText('marie@example.fr')).toBeInTheDocument()
  })

  it('happy : indique que l\'email ne peut pas être modifié', () => {
    render(<AccountSection email="marie@example.fr" />)

    expect(screen.getByText("L'adresse email ne peut pas être modifiée depuis cet espace.")).toBeInTheDocument()
  })

  it('death : n\'affiche aucun champ modifiable', () => {
    render(<AccountSection email="marie@example.fr" />)

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})
