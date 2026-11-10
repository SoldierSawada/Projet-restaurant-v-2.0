import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomeBenefits } from './HomeBenefits'

describe('HomeBenefits', () => {
  it('happy : affiche les quatre atouts de la maison', () => {
    render(<HomeBenefits />)

    expect(screen.getByRole('heading', { name: "Produits d'Alsace" })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cuisine maison' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Vins au verre' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tables partagées' })).toBeInTheDocument()
  })

  it('happy : affiche une liste de quatre éléments', () => {
    render(<HomeBenefits />)

    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('death : ne propose aucun lien ni bouton', () => {
    render(<HomeBenefits />)

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
