import type { RaidenSettings } from '../state/types'

const HOST_HEADLINES = new Set([
  '探索未至之境',
  'Into the Unknown',
  '雷电将军 · 尘世七执政 · 永恒',
])
export const RAIDEN_HERO_HEADLINE = '原神！！！启动！！！'
export const HERO_TEXT_SELECTOR = "[class*='headlineText']"

export interface HeroCopySync {
  apply: (root: ParentNode) => void
  restore: () => void
}

export function resolveHeroHeadline(_settings?: RaidenSettings): string {
  return RAIDEN_HERO_HEADLINE
}

/** DSH owns this text; keep an exact snapshot so plugin dispose restores it. */
export function createHeroCopySync(getHeadline: () => string): HeroCopySync {
  const originals = new Map<HTMLElement, string>()
  const themeHeadlines = new Set<string>()

  return {
    apply(root: ParentNode): void {
      const headline = getHeadline()
      for (const node of root.querySelectorAll(HERO_TEXT_SELECTOR)) {
        if (!(node instanceof HTMLElement)) continue
        const text = node.textContent ?? ''
        const trimmed = text.trim()
        if (HOST_HEADLINES.has(trimmed)) {
          if (!originals.has(node)) originals.set(node, text)
          node.textContent = headline
          continue
        }
        if (originals.has(node) || themeHeadlines.has(trimmed)) {
          node.textContent = headline
        }
      }
      themeHeadlines.add(headline)
    },
    restore(): void {
      for (const [node, text] of originals) {
        if (node.isConnected) node.textContent = text
      }
      originals.clear()
      themeHeadlines.clear()
    },
  }
}

export function touchesHeroCopy(node: Node): boolean {
  if (!(node instanceof Element)) return false
  return node.matches(HERO_TEXT_SELECTOR)
    || node.closest("[class*='headline']") !== null
    || node.querySelector(HERO_TEXT_SELECTOR) !== null
}
