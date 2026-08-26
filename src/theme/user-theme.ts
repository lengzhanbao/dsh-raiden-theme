import type { RaidenColorConfig, RaidenColorPreset } from '../state/types'
import { sanitizeColorField } from '../assets/validate'
import { restoreInlineStyles, snapshotInlineStyles, type InlineStyleSnapshot } from '../client/inline-restore'

export interface ThemeTokens {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  success: string
  warning: string
  error: string
}

const PRESETS: Record<Exclude<RaidenColorPreset, 'custom'>, ThemeTokens> = {
  'raiden-violet': {
    primary: '#a78bfa',
    secondary: '#493b50',
    accent: '#e7b957',
    background: '#fff7f1',
    surface: '#fffdfb',
    text: '#141018',
    success: '#e7b957',
    warning: '#e7b957',
    error: '#c43c3c',
  },
  'raiden-night': {
    primary: '#c4b5fd',
    secondary: '#bfaeeb',
    accent: '#e7be62',
    background: '#211b32',
    surface: '#2a2340',
    text: '#fff3e8',
    success: '#e7be62',
    warning: '#e7be62',
    error: '#c43c3c',
  },
  'raiden-sakura': {
    primary: '#a78bfa',
    secondary: '#91d5e8',
    accent: '#e7b957',
    background: '#f6fbfc',
    surface: '#ffffff',
    text: '#141018',
    success: '#e7b957',
    warning: '#e7b957',
    error: '#c43c3c',
  },
}

const TAFFY_TOKEN_KEYS = [
  '--ds-raiden-pink',
  '--ds-raiden-charcoal',
  '--ds-raiden-gold',
  '--ds-raiden-ribbon',
  '--ds-raiden-text',
  '--raiden-pink',
  '--raiden-gold',
] as const

export function resolveThemeTokens(colors: RaidenColorConfig): ThemeTokens {
  const base = colors.preset === 'custom'
    ? PRESETS['raiden-violet']
    : PRESETS[colors.preset]

  return {
    primary: sanitizeColorField(colors.primary) ?? base.primary,
    secondary: sanitizeColorField(colors.secondary) ?? base.secondary,
    accent: sanitizeColorField(colors.accent) ?? base.accent,
    background: sanitizeColorField(colors.background) ?? base.background,
    surface: sanitizeColorField(colors.surface) ?? base.surface,
    text: sanitizeColorField(colors.text) ?? base.text,
    success: sanitizeColorField(colors.success) ?? base.success,
    warning: sanitizeColorField(colors.warning) ?? base.warning,
    error: sanitizeColorField(colors.error) ?? base.error,
  }
}

export function snapshotThemeTokens(root: HTMLElement): InlineStyleSnapshot[] {
  return snapshotInlineStyles(root, TAFFY_TOKEN_KEYS)
}

export function applyThemeTokens(root: HTMLElement, tokens: ThemeTokens, options?: { pinText?: boolean }): void {
  root.style.setProperty('--ds-raiden-pink', tokens.primary)
  root.style.setProperty('--ds-raiden-charcoal', tokens.secondary)
  root.style.setProperty('--ds-raiden-gold', tokens.accent)
  root.style.setProperty('--ds-raiden-ribbon', tokens.error)
  root.style.setProperty('--raiden-pink', tokens.primary)
  root.style.setProperty('--raiden-gold', tokens.accent)
  // Preset text must stay on CSS so light/dark can switch. Inline --ds-raiden-text
  // would pin candy ink onto dark theme and make chat unreadable.
  if (options?.pinText) root.style.setProperty('--ds-raiden-text', tokens.text)
  else root.style.removeProperty('--ds-raiden-text')
}

export function restoreThemeTokens(root: HTMLElement, snapshot: readonly InlineStyleSnapshot[]): void {
  restoreInlineStyles(root, snapshot)
}
