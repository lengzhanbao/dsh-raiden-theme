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

export const DEFAULT_HERO_HEADLINE = RAIDEN_HERO_HEADLINE

export function resolveHeroHeadline(settings?: RaidenSettings): string {
  const custom = settings?.heroHeadline?.trim()
  return custom || RAIDEN_HERO_HEADLINE
}

/** DSH owns this text; keep an exact snapshot so plugin dispose restores it. */
export function createHeroCopySync(getHeadline: () => string = () => DEFAULT_HERO_HEADLINE): HeroCopySync {
  const originals = new Map<HTMLElement, { original: string, applied: string }>()

  return {
    apply(root: ParentNode): void {
      const headline = getHeadline()
      for (const node of root.querySelectorAll(HERO_TEXT_SELECTOR)) {
        if (!(node instanceof HTMLElement)) continue
        const text = node.textContent ?? ''
        const known = originals.get(node)
        if (known ? text !== known.applied : !HOST_HEADLINES.has(text.trim())) continue
        if (known) known.applied = headline
        else originals.set(node, { original: text, applied: headline })
        node.textContent = headline
      }
    },
    restore(): void {
      for (const [node, record] of originals) {
        if (node.isConnected && node.textContent === record.applied) node.textContent = record.original
      }
      originals.clear()
    },
  }
}

export function touchesHeroCopy(node: Node): boolean {
  if (!(node instanceof Element)) return false
  return node.matches(HERO_TEXT_SELECTOR)
    || node.closest("[class*='headline']") !== null
    || node.querySelector(HERO_TEXT_SELECTOR) !== null
}
