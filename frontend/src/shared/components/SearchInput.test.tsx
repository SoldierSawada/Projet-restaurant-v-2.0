import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('happy : affiche la valeur courante', () => {
    renderWithProviders(<SearchInput value="choucroute" onChange={vi.fn()} />)

    expect(screen.getByRole('searchbox')).toHaveValue('choucroute')
  })

  it('happy : transmet la nouvelle valeur à chaque saisie', () => {
    const onChange = vi.fn()
    renderWithProviders(<SearchInput value="" onChange={onChange} placeholder="Chercher un plat" />)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Chercher un plat' }), { target: { value: 'kugel' } })

    expect(onChange).toHaveBeenCalledWith('kugel')
  })

  it('death : n\'appelle pas onChange sans saisie', () => {
    const onChange = vi.fn()
    renderWithProviders(<SearchInput value="" onChange={onChange} />)

    expect(onChange).not.toHaveBeenCalled()
  })
})
