import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SettingsSection } from './SettingsSection'

describe('SettingsSection', () => {
  it('happy : est une région nommée par son titre', () => {
    render(
      <SettingsSection id="notifications" title="Notifications" description="Gérez vos alertes.">
        <p>Contenu</p>
      </SettingsSection>,
    )

    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument()
  })

  it('happy : affiche la description et le contenu transmis', () => {
    render(
      <SettingsSection id="notifications" title="Notifications" description="Gérez vos alertes.">
        <p>Contenu</p>
      </SettingsSection>,
    )

    expect(screen.getByText('Gérez vos alertes.')).toBeInTheDocument()
    expect(screen.getByText('Contenu')).toBeInTheDocument()
  })

  it('death : affiche le titre même sans contenu', () => {
    render(
      <SettingsSection id="compte" title="Mon compte" description="Vos informations.">
        {null}
      </SettingsSection>,
    )

    expect(screen.getByRole('heading', { name: 'Mon compte' })).toBeInTheDocument()
  })
})
