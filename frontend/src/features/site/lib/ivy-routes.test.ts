import { describe, expect, it } from 'vitest'
import { isIvyPath } from './ivy-routes'

describe('isIvyPath', () => {
  it('happy : accepte les pages publiques décorées', () => {
    expect(isIvyPath('/carte')).toBe(true)
    expect(isIvyPath('/carte/boissons')).toBe(true)
    expect(isIvyPath('/avis')).toBe(true)
    expect(isIvyPath('/a-propos')).toBe(true)
    expect(isIvyPath('/contact')).toBe(true)
    expect(isIvyPath('/blog')).toBe(true)
    expect(isIvyPath('/blog/article-1')).toBe(true)
    expect(isIvyPath('/reserver')).toBe(true)
  })

  it('death : refuse les pages membre, admin et les chemins proches', () => {
    expect(isIvyPath('/')).toBe(false)
    expect(isIvyPath('/admin')).toBe(false)
    expect(isIvyPath('/mon-espace')).toBe(false)
    expect(isIvyPath('/login')).toBe(false)
    expect(isIvyPath('/carteX')).toBe(false)
  })
})
