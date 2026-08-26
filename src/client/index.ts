/**
 * Browser client entry for @dsh-external/dsh-raiden-theme.
 * Host apply() is empty; this file owns chrome, CSS, and General-row settings.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { RaidenAgentState } from '../state/types'
import { resetStateAdapter } from '../state/adapter'
import { applyThemeTokens, restoreThemeTokens, resolveThemeTokens, snapshotThemeTokens } from '../theme/user-theme'
import { resolveTimePhase, startTimePhaseTicker } from '../theme/time-theme'
import { loadSettings, saveSettings, subscribeSettings } from './settings-store'
import { ensureStyleNode, removeStyleNode } from './styles'
import {
  clearMetricsStamp,
  resetMetricsStampState,
  setMetricsEnabledGetter,
  stampMetrics,
} from './metrics-stamp'
import { startBackdropSync } from './backdrop'
import { startProjectedState } from './projected-state'
import { startSidebarMetrics } from './sidebar-metrics'
import { startConversationMetrics } from './conversation-metrics'
import { startAcrylicSurfaces } from './acrylic-surfaces'
import { createChromeObserver } from './chrome-observer'
import {
  applyRootAttributes,
  createCharacterStage,
  createStageCurtains,
  createTrims,
  removeOwnedChrome,
  syncStageArt,
  syncSidebarMascot,
  TAFFY_INLINE_STYLE_KEYS,
} from './mount'
import { restoreInlineStyles, snapshotInlineStyles } from './inline-restore'
import { createStateObserver } from './state-view'
import { registerSettingsPanel } from './settings-panel'

export const name = '@dsh-external/dsh-raiden-theme'
export const inject = ['slots', 'locale']

export function apply(ctx: ClientContext): void {
  const body = document.body
  const tokenSnapshot = snapshotThemeTokens(body)
  const inlineSnapshot = snapshotInlineStyles(body, TAFFY_INLINE_STYLE_KEYS)
  let settings = loadSettings()
  let state: RaidenAgentState = 'idle'
  let chromeMounted = false
  let disposeStateObserver: (() => void) | undefined
  let disposeTimePhase: (() => void) | undefined
  let disposeSettingsSub: (() => void) | undefined
  let disposeBackdrop: (() => void) | undefined
  let disposeProjectedState: (() => void) | undefined
  let disposeSidebarMetrics: (() => void) | undefined
  let disposeConversationMetrics: (() => void) | undefined
  let disposeAcrylicSurfaces: (() => void) | undefined
  let disposeChromeObserver: (() => void) | undefined

  const restoreHostStyles = (): void => {
    restoreThemeTokens(body, tokenSnapshot)
    restoreInlineStyles(body, inlineSnapshot)
  }

  const disposeChromeRuntime = (): void => {
    disposeBackdrop?.()
    disposeBackdrop = undefined
    disposeProjectedState?.()
    disposeProjectedState = undefined
    disposeSidebarMetrics?.()
    disposeSidebarMetrics = undefined
    disposeConversationMetrics?.()
    disposeConversationMetrics = undefined
    disposeAcrylicSurfaces?.()
    disposeAcrylicSurfaces = undefined
    disposeChromeObserver?.()
    disposeChromeObserver = undefined
  }

  const unmountChrome = (): void => {
    disposeChromeRuntime()
    removeOwnedChrome(document)
    chromeMounted = false
  }

  const syncTheme = (): void => {
    ensureStyleNode(document)
    if (!settings.enabled) {
      applyRootAttributes(body, settings, state)
      restoreHostStyles()
      stampMetrics(document, body)
      return
    }
    applyThemeTokens(body, resolveThemeTokens(settings.colors), {
      pinText: settings.colors.preset === 'custom' && Boolean(settings.colors.text),
    })
    applyRootAttributes(body, settings, state)
    if (settings.timePhaseEnabled) body.setAttribute('data-time-phase', resolveTimePhase())
    else body.removeAttribute('data-time-phase')
    stampMetrics(document, body)
  }

  const mountStaticChrome = (): void => {
    if (chromeMounted) {
      syncStageArt(body, settings)
      if (!body.querySelector("[data-skin-chrome='raiden-top-curtain']")) {
        for (const node of createStageCurtains()) body.append(node)
      }
      return
    }
    if (!settings.enabled) return

    removeOwnedChrome(document)
    const stage = createCharacterStage(settings)
    if (stage) body.prepend(stage)
    for (const trim of createTrims()) body.append(trim)

    disposeBackdrop = startBackdropSync(body)
    disposeProjectedState = startProjectedState(body)
    disposeSidebarMetrics = startSidebarMetrics(document)
    disposeConversationMetrics = startConversationMetrics(document, body)
    disposeAcrylicSurfaces = startAcrylicSurfaces(document)
    disposeChromeObserver = createChromeObserver({
      getSettings: () => settings,
    }).disconnect
    chromeMounted = true
  }

  const ensureChrome = (): void => {
    if (!settings.enabled) {
      unmountChrome()
      return
    }
    mountStaticChrome()
  }

  ctx.effect(() => {
    resetMetricsStampState()
    setMetricsEnabledGetter(() => settings.enabled)
    ensureStyleNode(document)
    syncTheme()
    ensureChrome()
    disposeStateObserver = createStateObserver({
      onState: (next) => {
        state = next
        if (settings.enabled) body.setAttribute('data-raiden-state', state)
      },
    })
    disposeTimePhase = settings.timePhaseEnabled
      ? startTimePhaseTicker((phase: string) => body.setAttribute('data-time-phase', phase))
      : undefined
    disposeSettingsSub = subscribeSettings((next) => {
      settings = next
      syncTheme()
      ensureChrome()
      syncSidebarMascot(settings, document)
    })

    return () => {
      disposeStateObserver?.()
      disposeStateObserver = undefined
      disposeTimePhase?.()
      disposeSettingsSub?.()
      unmountChrome()
      resetStateAdapter()
      removeStyleNode(document)
      clearMetricsStamp(document)
      body.removeAttribute('data-dsh-raiden-theme')
      body.removeAttribute('data-raiden-state')
      body.removeAttribute('data-raiden-preset')
      body.removeAttribute('data-raiden-chat-active')
      body.removeAttribute('data-raiden-conversation-active')
      body.removeAttribute('data-raiden-workspace')
      body.removeAttribute('data-raiden-better-sidebar-open')
      body.removeAttribute('data-raiden-details-open')
      body.removeAttribute('data-raiden-settings-open')
      body.removeAttribute('data-dsh-floating-panel-open')
      body.removeAttribute('data-time-phase')
      body.removeAttribute('data-dsh-raiden-intensity')
      body.removeAttribute('data-dsh-raiden-motion')
      body.removeAttribute('data-dsh-raiden-reduced-motion')
      body.removeAttribute('data-raiden-veil')
      body.removeAttribute('data-raiden-low-power')
      body.removeAttribute('data-raiden-acrylic-percent')
      body.removeAttribute('data-raiden-frame-opacity')
      body.removeAttribute('data-raiden-panel-opacity')
      body.removeAttribute('data-raiden-character-opacity')
      body.removeAttribute('data-raiden-scene')
      body.removeAttribute('data-raiden-hide-left')
      body.removeAttribute('data-raiden-hide-right')
      body.removeAttribute('data-raiden-hide-mascot')
      body.removeAttribute('data-raiden-hide-workspace-mascot')
      body.removeAttribute('data-raiden-right-crowded')
      body.removeAttribute('data-raiden-q-ready')
      delete body.dataset.raidenSidebarSize
      restoreHostStyles()
    }
  }, 'dsh-raiden-theme:lifecycle')

  registerSettingsPanel(ctx)

  if (!localStorage.getItem('dsh-raiden-theme:v1')) saveSettings(settings)
}
