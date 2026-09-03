import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS } from '../src/config.ts'
import { createHeroCopySync, resolveHeroHeadline, touchesHeroCopy } from '../src/client/hero-copy.ts'

describe('hero copy sync', () => {
  it('replaces the host hero headline and restores the exact original text', () => {
    const headline = document.createElement('span')
    headline.className = 'hero_headlineText'
    headline.textContent = '探索未至之境'
    document.body.append(headline)

    const heroCopy = createHeroCopySync(() => resolveHeroHeadline(DEFAULT_SETTINGS))
    heroCopy.apply(document.body)
    expect(headline.textContent).toBe('原神！！！启动！！！')

    heroCopy.restore()
    expect(headline.textContent).toBe('探索未至之境')
    headline.remove()
  })

  it('replaces the English host headline', () => {
    const headline = document.createElement('span')
    headline.className = 'hero_headlineText'
    headline.textContent = 'Into the Unknown'
    document.body.append(headline)

    const heroCopy = createHeroCopySync(() => resolveHeroHeadline(DEFAULT_SETTINGS))
    heroCopy.apply(document.body)
    expect(headline.textContent).toBe('原神！！！启动！！！')
    headline.remove()
  })

  it('applies a settings-driven headline and still restores the original', () => {
    const headline = document.createElement('span')
    headline.className = 'hero_headlineText'
    headline.textContent = '探索未至之境'
    document.body.append(headline)

    let custom = '自定义雷电标题'
    const heroCopy = createHeroCopySync(() => custom)
    heroCopy.apply(document.body)
    expect(headline.textContent).toBe('自定义雷电标题')

    custom = '换一句永恒'
    heroCopy.apply(document.body)
    expect(headline.textContent).toBe('换一句永恒')

    heroCopy.restore()
    expect(headline.textContent).toBe('探索未至之境')
    headline.remove()
  })

  it('falls back to the default headline when settings text is blank', () => {
    expect(resolveHeroHeadline({ ...DEFAULT_SETTINGS, heroHeadline: '   ' })).toBe('原神！！！启动！！！')
  })

  it('detects either a mounted headline or a wrapper containing one', () => {
    const headline = document.createElement('span')
    headline.className = 'hero_headlineText'
    const wrapper = document.createElement('div')
    wrapper.append(headline)

    expect(touchesHeroCopy(headline)).toBe(true)
    expect(touchesHeroCopy(wrapper)).toBe(true)
    expect(touchesHeroCopy(document.createElement('div'))).toBe(false)
  })
})
