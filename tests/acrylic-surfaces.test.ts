import { afterEach, describe, expect, it } from 'vitest'
import { startAcrylicSurfaces } from '../src/client/acrylic-surfaces.ts'

describe('acrylic surfaces', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('does not auto-mark overlay children, details, or floating panels', () => {
    const overlay = document.createElement('div')
    overlay.setAttribute('data-shell-overlay', '')
    const panel = document.createElement('div')
    overlay.append(panel)
    const details = document.createElement('div')
    details.setAttribute('data-pane', 'details')
    const floating = document.createElement('div')
    floating.setAttribute('data-dsh-floating-panel', '')
    const cordis = document.createElement('div')
    cordis.setAttribute('data-cordis-panel', '')
    document.body.append(overlay, details, floating, cordis)

    const dispose = startAcrylicSurfaces(document)
    expect(panel.hasAttribute('data-raiden-surface')).toBe(false)
    expect(details.hasAttribute('data-raiden-surface')).toBe(false)
    expect(floating.hasAttribute('data-raiden-surface')).toBe(false)
    expect(cordis.hasAttribute('data-raiden-surface')).toBe(false)
    dispose()
  })

  it('leaves plugin-declared surfaces untouched', () => {
    const panel = document.createElement('div')
    panel.setAttribute('data-plugin-root', 'example')
    panel.setAttribute('data-raiden-surface', 'acrylic')
    document.body.append(panel)

    const dispose = startAcrylicSurfaces(document)
    expect(panel.getAttribute('data-raiden-surface')).toBe('acrylic')
    expect(panel.hasAttribute('data-raiden-surface-owner')).toBe(false)
    dispose()
    expect(panel.getAttribute('data-raiden-surface')).toBe('acrylic')
  })

  it('clears leftover owner attributes from older builds', () => {
    const panel = document.createElement('div')
    panel.setAttribute('data-raiden-surface', 'acrylic')
    panel.setAttribute('data-raiden-surface-owner', 'dsh-raiden-theme')
    document.body.append(panel)

    const dispose = startAcrylicSurfaces(document)
    expect(panel.hasAttribute('data-raiden-surface')).toBe(false)
    expect(panel.hasAttribute('data-raiden-surface-owner')).toBe(false)
    dispose()
  })
})
