import type { RaidenAgentState, RaidenSettings } from '../state/types'
import {
  isNightScene,
  resolveFigureUrls,
  resolvePortraitFallback,
  resolveQChromeUrls,
  resolveWallpaperUrl,
} from '../assets/resolve'
import { BUNDLED_ARCHIVE_GIF, BUNDLED_ARCHIVE_GIF_DARK, BUNDLED_ARCHIVE_STILL, BUNDLED_ARCHIVE_STILL_DARK } from './bundled-q'
import { BUNDLED_HERO_AVATAR, BUNDLED_PORTRAIT } from './bundled-assets'
import { isAllowedImageProtocol } from '../assets/validate'
import { SKIN_OWNER, SIDEBAR_SELECTOR } from './chrome-selectors'
import { veilBucket } from './settings-store'
import { shouldUseLowPower } from './performance'

const ROOT_ATTR = 'data-dsh-raiden-theme'

const Q_VARS = [
  '--raiden-hero-avatar',
  '--raiden-q-face',
  '--raiden-q-send',
  '--raiden-q-stop',
  '--raiden-q-new',
  '--raiden-q-settings',
  '--raiden-q-brand',
  '--raiden-q-brand-right',
  '--raiden-q-command',
] as const

function tagChrome(node: HTMLElement, chrome: string): HTMLElement {
  node.dataset.skinOwner = SKIN_OWNER
  node.dataset.skinChrome = chrome
  node.setAttribute('aria-hidden', 'true')
  return node
}

export function bindAssetFallback(image: HTMLImageElement, fallbackSrc?: string): void {
  image.addEventListener('error', () => {
    const current = image.getAttribute('src') ?? ''
    if (fallbackSrc && current !== fallbackSrc) {
      delete image.dataset.raidenAssetError
      image.src = fallbackSrc
      return
    }
    image.dataset.raidenAssetError = ''
  })
  image.addEventListener('load', () => {
    delete image.dataset.raidenAssetError
  })
}

export function applyImageSrc(image: HTMLImageElement, src: string): void {
  delete image.dataset.raidenAssetError
  if (image.getAttribute('src') === src) return
  image.src = src
}

function makeImage(src: string, character: 'left' | 'right', pose: 'sit' | 'stand' | 'bust'): HTMLImageElement {
  const image = document.createElement('img')
  image.dataset.skinOwner = SKIN_OWNER
  image.dataset.raidenCharacter = character
  image.dataset.raidenPose = pose
  image.alt = ''
  image.decoding = 'async'
  bindAssetFallback(image, resolvePortraitFallback())
  applyImageSrc(image, src)
  return image
}

function scenePoses(night: boolean): { left: 'sit' | 'stand' | 'bust'; right: 'sit' | 'stand' | 'bust' } {
  return night
    ? { left: 'bust', right: 'sit' }
    : { left: 'sit', right: 'stand' }
}

function makeMascot(src: string): HTMLImageElement {
  const image = document.createElement('img')
  image.dataset.skinOwner = SKIN_OWNER
  image.dataset.raidenMascot = 'sidebar'
  image.alt = ''
  image.decoding = 'async'
  bindAssetFallback(image, resolvePortraitFallback())
  applyImageSrc(image, src)
  return image
}

const Q_PRELOAD_TIMEOUT_MS = 12_000

function preloadImage(url: string, timeoutMs = Q_PRELOAD_TIMEOUT_MS): Promise<boolean> {
  if (!url || url === 'none') return Promise.resolve(false)
  if (url.startsWith('data:image/')) return Promise.resolve(true)
  return new Promise((resolve) => {
    const image = new Image()
    let settled = false
    const finish = (ok: boolean): void => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      resolve(ok)
    }
    const timer = window.setTimeout(() => finish(false), timeoutMs)
    image.onload = () => finish(true)
    image.onerror = () => finish(false)
    image.src = url
  })
}

type QChromeEntry = readonly [key: string, url: string]
const Q_READY_ATTR = 'data-raiden-q-ready'
const appliedQChrome = new WeakMap<HTMLElement, string>()
const pendingQChrome = new WeakMap<HTMLElement, string>()
const preloadedQImages = new Map<string, Promise<boolean>>()
let qChromeEpoch = 0

function preloadQImage(url: string): Promise<boolean> {
  if (!url || url === 'none' || url.startsWith('data:image/')) return Promise.resolve(Boolean(url) && url !== 'none')
  const cached = preloadedQImages.get(url)
  if (cached) return cached
  const loaded = preloadImage(url)
  void loaded.then((ok) => {
    if (!ok) preloadedQImages.delete(url)
  })
  preloadedQImages.set(url, loaded)
  return loaded
}

function applyQChromeVars(body: HTMLElement, settings: RaidenSettings): void {
  const q = resolveQChromeUrls(settings)
  const entries: readonly QChromeEntry[] = [
    ['--raiden-q-face', q.face],
    ['--raiden-q-send', q.send],
    ['--raiden-q-stop', q.stop],
    ['--raiden-q-new', q.newSession],
    ['--raiden-q-settings', q.settings],
    ['--raiden-q-brand', q.brand],
    ['--raiden-q-brand-right', q.brandRight],
    ['--raiden-q-command', q.command],
  ]

  const signature = JSON.stringify(entries)
  const alreadyApplied = appliedQChrome.get(body) === signature
    && entries.every(([key, url]) => body.style.getPropertyValue(key) === `url("${url}")`)
    && body.hasAttribute(Q_READY_ATTR)
  if (alreadyApplied || pendingQChrome.get(body) === signature) return

  const epoch = ++qChromeEpoch
  pendingQChrome.set(body, signature)
  body.removeAttribute(Q_READY_ATTR)
  for (const [key] of entries) body.style.setProperty(key, 'none')

  void Promise.all(entries.map(async ([key, url]) => {
    const ok = await preloadQImage(url)
    if (epoch !== qChromeEpoch) return false
    body.style.setProperty(key, ok ? `url("${url}")` : 'none')
    return ok
  })).then((loaded) => {
    if (epoch !== qChromeEpoch) return
    if (loaded.every(Boolean)) appliedQChrome.set(body, signature)
    else appliedQChrome.delete(body)
    if (loaded.every(Boolean)) body.setAttribute(Q_READY_ATTR, '')
  }).finally(() => {
    if (pendingQChrome.get(body) === signature) pendingQChrome.delete(body)
  })
}


export function applyRootAttributes(body: HTMLElement, settings: RaidenSettings, state: RaidenAgentState): void {
  if (!settings.enabled) {
    body.removeAttribute(ROOT_ATTR)
    body.removeAttribute('data-raiden-state')
    body.removeAttribute('data-raiden-preset')
    body.removeAttribute('data-dsh-raiden-intensity')
    body.removeAttribute('data-dsh-raiden-motion')
    body.removeAttribute('data-dsh-raiden-reduced-motion')
    body.removeAttribute('data-raiden-veil')
    body.removeAttribute('data-raiden-acrylic-percent')
    body.removeAttribute('data-raiden-frame-opacity')
    body.removeAttribute('data-raiden-panel-opacity')
    body.removeAttribute('data-raiden-character-opacity')
    body.removeAttribute('data-raiden-scene')
    body.removeAttribute('data-raiden-hide-left')
    body.removeAttribute('data-raiden-hide-right')
    body.removeAttribute('data-raiden-hide-mascot')
    body.removeAttribute('data-raiden-hide-workspace-mascot')
    body.removeAttribute('data-raiden-q-ready')
    appliedQChrome.delete(body)
    body.removeAttribute('data-raiden-low-power')
    clearOpacityVars(body)
    return
  }

  body.setAttribute(ROOT_ATTR, '')
  body.setAttribute('data-raiden-state', state)
  body.setAttribute('data-raiden-preset', settings.colors.preset)
  body.setAttribute('data-dsh-raiden-intensity', settings.colors.dynamicIntensity)
  body.setAttribute('data-dsh-raiden-motion', settings.motion === 'off' ? 'off' : 'standard')
  body.setAttribute(
    'data-dsh-raiden-reduced-motion',
    settings.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'true' : 'false',
  )
  body.setAttribute('data-raiden-veil', veilBucket(settings))
  body.setAttribute('data-raiden-acrylic-percent', String(settings.acrylicPercent))
  body.setAttribute('data-raiden-frame-opacity', String(settings.frameOpacity))
  body.setAttribute('data-raiden-panel-opacity', String(settings.panelOpacity))
  body.setAttribute('data-raiden-character-opacity', String(settings.characterOpacity))
  body.setAttribute('data-raiden-scene', 'fused')
  applyOpacityVars(body, settings)
  const heroAvatar = settings.avatar !== 'default' && isAllowedImageProtocol(settings.avatar)
    ? settings.avatar
    : BUNDLED_HERO_AVATAR
  body.style.setProperty('--raiden-hero-avatar', `url("${heroAvatar}")`)
  body.toggleAttribute('data-raiden-hide-left', !settings.showLeftCharacter)
  body.toggleAttribute('data-raiden-hide-right', !settings.showRightCharacter)
  body.toggleAttribute('data-raiden-hide-mascot', true)
  body.toggleAttribute('data-raiden-hide-workspace-mascot', !settings.showWorkspaceMascot)
  body.toggleAttribute('data-raiden-low-power', shouldUseLowPower(settings))
  applyQChromeVars(body, settings)
}

export function syncStageArt(root: HTMLElement = document.body, settings?: RaidenSettings): void {
  const night = isNightScene(root)
  const wallpaper = root.querySelector('[data-raiden-wallpaper]')
  const wallpaperUrl = resolveWallpaperUrl(night)
  if (wallpaper instanceof HTMLImageElement && wallpaperUrl) applyImageSrc(wallpaper, wallpaperUrl)

  const figures = resolveFigureUrls(night)
  const poses = scenePoses(night)
  const left = root.querySelector("[data-raiden-character='left']")
  const right = root.querySelector("[data-raiden-character='right']")
  const mascot = root.querySelector("[data-raiden-mascot='sidebar']")
  if (left instanceof HTMLImageElement) {
    left.dataset.raidenPose = poses.left
    applyImageSrc(left, figures.left)
  }
  if (right instanceof HTMLImageElement) {
    right.dataset.raidenPose = poses.right
    applyImageSrc(right, figures.right)
  }
  if (settings && mascot instanceof HTMLImageElement) applyImageSrc(mascot, BUNDLED_HERO_AVATAR)
  const workspaceMascot = root.querySelector('[data-raiden-workspace-mascot]')
  if (workspaceMascot instanceof HTMLImageElement && settings?.showWorkspaceMascot) {
    const reduced = Boolean(settings?.reducedMotion)
      || (typeof window !== 'undefined'
        && typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const src = night
      ? (reduced ? BUNDLED_ARCHIVE_STILL_DARK : BUNDLED_ARCHIVE_GIF_DARK)
      : (reduced ? BUNDLED_ARCHIVE_STILL : BUNDLED_ARCHIVE_GIF)
    applyImageSrc(workspaceMascot, src)
  }
}

export function createCharacterStage(settings: RaidenSettings): HTMLElement | null {
  if (!settings.enabled) return null

  const night = isNightScene()
  const stage = tagChrome(document.createElement('div'), 'character-stage')
  const wallpaperUrl = resolveWallpaperUrl(night)
  if (wallpaperUrl) {
    const wallpaper = document.createElement('img')
    wallpaper.dataset.skinOwner = SKIN_OWNER
    wallpaper.dataset.raidenWallpaper = 'paper'
    wallpaper.alt = ''
    wallpaper.decoding = 'async'
    wallpaper.width = 1920
    wallpaper.height = 1280
    bindAssetFallback(wallpaper)
    applyImageSrc(wallpaper, wallpaperUrl)
    stage.append(wallpaper)
  }

  const veil = document.createElement('div')
  veil.dataset.skinOwner = SKIN_OWNER
  veil.dataset.raidenVeil = 'curtain'
  stage.append(veil)

  const sparkles = document.createElement('div')
  sparkles.dataset.skinOwner = SKIN_OWNER
  sparkles.dataset.raidenSparkles = 'ambient'
  sparkles.setAttribute('aria-hidden', 'true')

  const atmosphere = document.createElement('div')
  atmosphere.dataset.skinOwner = SKIN_OWNER
  atmosphere.dataset.raidenAtmosphere = 'haze'
  atmosphere.setAttribute('aria-hidden', 'true')

  stage.append(atmosphere, sparkles)
  return stage
}

export function createAtelierFrame(): HTMLElement {
  const frame = tagChrome(document.createElement('div'), 'atelier-frame')
  const corners = document.createElement('span')
  corners.dataset.raidenFrameCorners = ''
  corners.setAttribute('aria-hidden', 'true')
  for (const corner of ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const) {
    const node = document.createElement('span')
    node.dataset.raidenFrameCorner = corner
    node.setAttribute('aria-hidden', 'true')
    corners.append(node)
  }
  const badge = document.createElement('span')
  badge.dataset.raidenFrameBadge = ''
  badge.setAttribute('aria-hidden', 'true')
  frame.append(corners, badge)
  return frame
}

export function createStageCurtains(): HTMLElement[] {
  const top = tagChrome(document.createElement('div'), 'raiden-top-curtain')
  const bottom = tagChrome(document.createElement('div'), 'raiden-bottom-curtain')
  return [top, bottom]
}

export function createSidebarTrim(): HTMLElement {
  const trim = tagChrome(document.createElement('div'), 'sidebar-trim')
  for (const corner of ['top-left', 'top-right', 'bottom-right', 'bottom-left'] as const) {
    const node = document.createElement('span')
    node.dataset.raidenSidebarCorner = corner
    node.setAttribute('aria-hidden', 'true')
    trim.append(node)
  }
  for (const part of ['ribbon', 'swag'] as const) {
    const node = document.createElement('span')
    node.dataset.raidenSidebarOrnament = part
    node.setAttribute('aria-hidden', 'true')
    trim.append(node)
  }
  return trim
}

export function createTrims(): HTMLElement[] {
  return [...createStageCurtains(), createAtelierFrame(), createSidebarTrim()]
}

function findWorkspaceHost(sidebar: HTMLElement): HTMLElement | null {
  const labels = new Set(['工作区', 'Workspaces', '会话', 'Sessions'])
  for (const span of sidebar.querySelectorAll('span')) {
    if (!labels.has((span.textContent ?? '').trim())) continue
    const header = span.parentElement
    const root = header?.parentElement
    if (root instanceof HTMLElement) return root
    if (header instanceof HTMLElement) return header
  }
  const search = sidebar.querySelector(
    'button[aria-label="搜索会话"], button[aria-label="Search sessions"]',
  )
  if (search instanceof HTMLElement) {
    const header = search.closest('[class*="sectionHeader"]')
    const root = header?.parentElement
    if (root instanceof HTMLElement) return root
  }
  return null
}

export function decorateSidebar(settings: RaidenSettings, sidebar: HTMLElement): HTMLElement[] {
  const existing = sidebar.querySelector('[data-raiden-workspace-mascot]')
  if (!settings.showWorkspaceMascot) {
    if (existing instanceof HTMLElement) existing.remove()
    const host = sidebar.querySelector('[data-raiden-workspace-host]')
    if (host instanceof HTMLElement) delete host.dataset.raidenWorkspaceHost
    return []
  }

  const host = findWorkspaceHost(sidebar)
  if (!host) {
    if (existing instanceof HTMLElement) existing.remove()
    return []
  }

  host.dataset.raidenWorkspaceHost = ''
  let gif = existing instanceof HTMLImageElement ? existing : null
  if (!gif) {
    gif = document.createElement('img')
    gif.dataset.skinOwner = SKIN_OWNER
    gif.dataset.raidenWorkspaceMascot = ''
    gif.alt = ''
    gif.decoding = 'async'
    gif.setAttribute('aria-hidden', 'true')
  }
  if (gif.parentElement !== host) host.append(gif)

  const reduced = settings.reducedMotion
    || (typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const night = isNightScene()
  const src = night
    ? (reduced ? BUNDLED_ARCHIVE_STILL_DARK : BUNDLED_ARCHIVE_GIF_DARK)
    : (reduced ? BUNDLED_ARCHIVE_STILL : BUNDLED_ARCHIVE_GIF)
  applyImageSrc(gif, src)
  return [gif]
}

export function syncSidebarMascot(settings: RaidenSettings, root: ParentNode = document): void {
  const sidebar = root.querySelector(SIDEBAR_SELECTOR)
  if (!(sidebar instanceof HTMLElement)) return
  decorateSidebar(settings, sidebar)
}

export function removeOwnedChrome(root: ParentNode = document): void {
  root.querySelectorAll(`[data-skin-owner="${SKIN_OWNER}"]`).forEach((node) => node.remove())
}

const OPACITY_VARS = [
  '--raiden-frame-opacity',
  '--raiden-panel-opacity',
  '--raiden-veil-opacity',
  '--raiden-character-opacity',
  '--raiden-acrylic-percent',
] as const

function clearOpacityVars(body: HTMLElement): void {
  for (const key of OPACITY_VARS) body.style.removeProperty(key)
}

function applyOpacityVars(body: HTMLElement, settings: RaidenSettings): void {
  body.style.setProperty('--raiden-frame-opacity', String(settings.frameOpacity / 100))
  body.style.setProperty('--raiden-panel-opacity', String(settings.panelOpacity))
  body.style.setProperty('--raiden-veil-opacity', String(settings.veilOpacity / 100))
  body.style.setProperty('--raiden-character-opacity', String(settings.characterOpacity / 100))
  body.style.setProperty('--raiden-acrylic-percent', String(settings.acrylicPercent))
}

export const RAIDEN_INLINE_STYLE_KEYS = [
  ...Q_VARS,
  ...OPACITY_VARS,
  '--raiden-conversation-left',
  '--raiden-conversation-top',
  '--raiden-conversation-width',
  '--raiden-conversation-height',
  '--raiden-conversation-content-left',
  '--raiden-conversation-content-width',
  '--raiden-conversation-viewport-top',
  '--raiden-conversation-viewport-height',
  '--raiden-content-left',
  '--raiden-content-width',
  '--raiden-viewport-top',
  '--raiden-viewport-height',
  '--raiden-frame-left',
  '--raiden-frame-top',
  '--raiden-frame-width',
  '--raiden-frame-height',
  '--raiden-right-panel-width',
  '--raiden-frame-right-inset',
] as const
