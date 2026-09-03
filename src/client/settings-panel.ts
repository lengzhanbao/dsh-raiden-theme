// @ts-nocheck
import { createElement, useEffect, useRef, useState } from 'react'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { RaidenSettings } from '../state/types'
import { loadSettings, saveSettings } from './settings-store'
import { RAIDEN_HERO_HEADLINE } from './hero-copy'

const SETTINGS_NS = 'settings.raidenTheme'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'settings.general.item': { kind: 'list'; scope: 'root' }
  }
}

function CloverIcon() {
  return createElement('svg', {
    className: 'dsh-raiden-clover',
    viewBox: '0 0 16 16',
    width: 16,
    height: 16,
    'aria-hidden': 'true',
  },
    createElement('path', {
      fill: 'currentColor',
      d: 'M8 1.6c1.4 1.6 1.6 3.4 1.2 4.6 1.2-.6 2.8-.4 4 0.8 1 1 1 2.6 0 3.6-1 1-2.5 1.1-3.6.4 0.3 1.2 0 2.9-1.6 4.4-1.6-1.5-1.9-3.2-1.6-4.4-1.1.7-2.6.6-3.6-.4-1-1-1-2.6 0-3.6 1.2-1.2 2.8-1.4 4-.8C6.4 5 6.6 3.2 8 1.6z',
    }),
  )
}

function Cube({
  selected,
  label,
  onClick,
}: {
  selected: boolean
  label: string
  onClick: () => void
}) {
  return createElement('button', {
    type: 'button',
    className: `dsh-raiden-general-cube${selected ? ' is-selected' : ''}`,
    'aria-pressed': selected,
    onClick,
  }, selected ? CloverIcon() : null, label)
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return createElement('label', { className: 'dsh-raiden-slider-row' },
    createElement('span', { className: 'dsh-raiden-slider-head' },
      createElement('span', null, label),
      createElement('output', null, `${value}%`),
    ),
    createElement('input', {
      type: 'range',
      min: 0,
      max: 100,
      step: 1,
      value,
      onInput: (event) => onChange(Number(event.currentTarget.value)),
      onChange: (event) => onChange(Number(event.currentTarget.value)),
    }),
  )
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}) {
  return createElement('label', { className: 'dsh-raiden-text-row' },
    createElement('span', { className: 'dsh-raiden-slider-head' },
      createElement('span', null, label),
    ),
    createElement('input', {
      type: 'text',
      value,
      placeholder,
      onInput: (event) => onChange(event.currentTarget.value),
    }),
  )
}

function RaidenModeRow() {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    const refresh = () => setSettings(loadSettings())
    window.addEventListener('storage', refresh)
    window.addEventListener('dsh-raiden-theme:settings-change', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('dsh-raiden-theme:settings-change', refresh)
    }
  }, [])

  const commitNow = (patch: Partial<RaidenSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
    saveSettings({ ...loadSettings(), ...patch })
  }

  const commitRef = useRef(commitNow)
  commitRef.current = commitNow

  const textTimer = useRef(0)
  useEffect(() => () => window.clearTimeout(textTimer.current), [])

  const commitText = (patch: Partial<RaidenSettings>) => {
    window.clearTimeout(textTimer.current)
    textTimer.current = window.setTimeout(() => commitRef.current(patch), 300)
  }

  const commit = (patch: Partial<RaidenSettings>) => {
    if ('heroHeadline' in patch || 'avatar' in patch) return commitText(patch)
    commitNow(patch)
  }

  return createElement('div', {
    className: 'dsh-raiden-general-row',
    'data-dsh-raiden-settings': '',
  },
    createElement('div', { className: 'dsh-raiden-general-title' }, '雷电将军工房'),
    createElement('div', { className: 'dsh-raiden-general-cubes' },
      createElement(Cube, { selected: settings.enabled, label: '开启', onClick: () => commit({ enabled: true }) }),
      createElement(Cube, { selected: !settings.enabled, label: '关闭', onClick: () => commit({ enabled: false }) }),
    ),
    createElement(Slider, {
      label: '边框透明度',
      value: settings.frameOpacity,
      onChange: (frameOpacity) => commit({ frameOpacity }),
    }),
    createElement(Slider, {
      label: '面板透明度',
      value: settings.panelOpacity,
      onChange: (panelOpacity) => commit({ panelOpacity }),
    }),
    createElement(Slider, {
      label: '背景纱',
      value: settings.veilOpacity,
      onChange: (veilOpacity) => commit({ veilOpacity }),
    }),
    createElement(Slider, {
      label: '亚克力透明度',
      value: settings.acrylicPercent,
      onChange: (acrylicPercent) => commit({ acrylicPercent }),
    }),
    createElement('div', { className: 'dsh-raiden-general-title' }, '立绘'),
    createElement('div', { className: 'dsh-raiden-general-cubes' },
      createElement(Cube, { selected: settings.showLeftCharacter, label: '左侧', onClick: () => commit({ showLeftCharacter: !settings.showLeftCharacter }) }),
      createElement(Cube, { selected: settings.showRightCharacter, label: '右侧', onClick: () => commit({ showRightCharacter: !settings.showRightCharacter }) }),
    ),
    createElement(Slider, {
      label: '立绘透明度',
      value: settings.characterOpacity,
      onChange: (characterOpacity) => commit({ characterOpacity }),
    }),
    createElement('div', { className: 'dsh-raiden-general-title' }, '个性化'),
    createElement(TextField, {
      label: '标题文案',
      value: settings.heroHeadline,
      placeholder: RAIDEN_HERO_HEADLINE,
      onChange: (heroHeadline) => commit({ heroHeadline: heroHeadline.trim() || RAIDEN_HERO_HEADLINE }),
    }),
    createElement(TextField, {
      label: '头像图片地址',
      value: settings.avatar === 'default' ? '' : settings.avatar,
      placeholder: '留空使用默认雷电头像',
      onChange: (avatar) => commit({ avatar: avatar.trim() || 'default' }),
    }),
    createElement('div', { className: 'dsh-raiden-general-title' }, '工作区 Q 版动图'),
    createElement('div', { className: 'dsh-raiden-general-cubes' },
      createElement(Cube, { selected: settings.showWorkspaceMascot, label: '开启', onClick: () => commit({ showWorkspaceMascot: true }) }),
      createElement(Cube, { selected: !settings.showWorkspaceMascot, label: '关闭', onClick: () => commit({ showWorkspaceMascot: false }) }),
    ),
    createElement('div', { className: 'dsh-raiden-general-title' }, '减弱动效'),
    createElement('div', { className: 'dsh-raiden-general-cubes' },
      createElement(Cube, { selected: settings.reducedMotion, label: '开启', onClick: () => commit({ reducedMotion: true, motion: 'off' }) }),
      createElement(Cube, { selected: !settings.reducedMotion, label: '关闭', onClick: () => commit({ reducedMotion: false, motion: 'standard' }) }),
    ),
    createElement('div', { className: 'dsh-raiden-general-note' },
      '紫金工房：浅色花房、深色雷舞台跟着「外观」走。面板尽量透明，贴进背景。想听雷电将军说话，去 Agent 预设里选「Raiden 雷电将军」。',
    ),
  )
}

export function registerSettingsPanel(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(SETTINGS_NS, {
    zh: { 'settings.raidenTheme.label': '雷电将军工房' },
    en: { 'settings.raidenTheme.label': 'Raiden atelier' },
  }), '@dsh-external/dsh-raiden-theme: locale')

  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'raiden-theme',
    order: 11,
    locale: SETTINGS_NS,
  }, RaidenModeRow))
}
