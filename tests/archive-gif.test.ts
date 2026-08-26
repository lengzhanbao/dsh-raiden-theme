import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS } from '../src/config.ts'
import { decorateSidebar } from '../src/client/mount.ts'
import { BUNDLED_ARCHIVE_GIF } from '../src/client/bundled-q.ts'

describe('workspace Q mascot', () => {
  it('pins the cutout action gif on the 工作区 browser, not 已归档', () => {
    const sidebar = document.createElement('div')
    sidebar.className = 'sidebarCol'
    const root = document.createElement('div')
    const header = document.createElement('div')
    header.className = 'sectionHeader'
    header.append(Object.assign(document.createElement('span'), { textContent: '工作区' }))
    root.append(header)
    const archive = document.createElement('div')
    archive.append(Object.assign(document.createElement('span'), { textContent: '已归档' }))
    sidebar.append(root, archive)
    document.body.append(sidebar)

    const nodes = decorateSidebar({ ...DEFAULT_SETTINGS, enabled: true }, sidebar)
    const gif = sidebar.querySelector('[data-raiden-workspace-mascot]')
    expect(nodes).toHaveLength(1)
    expect(gif).toBeInstanceOf(HTMLImageElement)
    expect(root.getAttribute('data-raiden-workspace-host')).toBe('')
    expect(archive.getAttribute('data-raiden-workspace-host')).toBeNull()
    expect((gif as HTMLImageElement).getAttribute('src')).toBe(BUNDLED_ARCHIVE_GIF)
    expect(gif?.parentElement).toBe(root)

    decorateSidebar({ ...DEFAULT_SETTINGS, enabled: true }, sidebar)
    expect(sidebar.querySelectorAll('[data-raiden-workspace-mascot]')).toHaveLength(1)

    root.remove()
    expect(decorateSidebar({ ...DEFAULT_SETTINGS, enabled: true }, sidebar)).toEqual([])
    expect(sidebar.querySelector('[data-raiden-workspace-mascot]')).toBeNull()
    sidebar.remove()
  })

  it('hides the workspace mascot when showWorkspaceMascot is false', () => {
    const sidebar = document.createElement('div')
    sidebar.className = 'sidebarCol'
    const root = document.createElement('div')
    root.append(Object.assign(document.createElement('span'), { textContent: '工作区' }))
    sidebar.append(root)
    document.body.append(sidebar)

    expect(decorateSidebar({ ...DEFAULT_SETTINGS, enabled: true, showWorkspaceMascot: false }, sidebar)).toEqual([])
    expect(sidebar.querySelector('[data-raiden-workspace-mascot]')).toBeNull()

    decorateSidebar({ ...DEFAULT_SETTINGS, enabled: true, showWorkspaceMascot: true }, sidebar)
    expect(sidebar.querySelector('[data-raiden-workspace-mascot]')).not.toBeNull()
    sidebar.remove()
  })
})
