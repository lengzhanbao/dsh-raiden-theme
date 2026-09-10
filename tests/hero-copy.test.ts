import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS } from '../src/config.ts'
import { createHeroCopySync, resolveHeroHeadline, touchesHeroCopy } from '../src/client/hero-copy.ts'

/** 新版空态结构：[data-phase='hero'] 下标题组裸 span（无 headlineText 类名）。 */
function mountHero(headlineText: string): { scope: HTMLElement, headline: HTMLElement } {
  const scope = document.createElement('div')
  scope.setAttribute('data-phase', 'hero')
  const group = document.createElement('span')
  const headline = document.createElement('span')
  headline.textContent = headlineText
  const badge = document.createElement('span')
  badge.textContent = '预览版'
  group.append(headline, badge)
  scope.append(group)
  document.body.append(scope)
  return { scope, headline }
}

describe('hero copy sync', () => {
  it('replaces the host hero headline and restores the exact original text', () => {
    const { scope, headline } = mountHero('探索未至之境')

    const heroCopy = createHeroCopySync(() => resolveHeroHeadline(DEFAULT_SETTINGS))
    heroCopy.apply(document.body)
    expect(headline.textContent).toBe('原神！！！启动！！！')

    heroCopy.restore()
    expect(headline.textContent).toBe('探索未至之境')
    scope.remove()
  })

  it('replaces the English host headline', () => {
    const { scope, headline } = mountHero('Into the Unknown')

    const heroCopy = createHeroCopySync(() => resolveHeroHeadline(DEFAULT_SETTINGS))
    heroCopy.apply(document.body)
    expect(headline.textContent).toBe('原神！！！启动！！！')
    scope.remove()
  })

  it('applies a settings-driven headline and still restores the original', () => {
    const { scope, headline } = mountHero('探索未至之境')

    let custom = '自定义雷电标题'
    const heroCopy = createHeroCopySync(() => custom)
    heroCopy.apply(document.body)
    expect(headline.textContent).toBe('自定义雷电标题')

    custom = '换一句永恒'
    heroCopy.apply(document.body)
    expect(headline.textContent).toBe('换一句永恒')

    heroCopy.restore()
    expect(headline.textContent).toBe('探索未至之境')
    scope.remove()
  })

  it('falls back to the default headline when settings text is blank', () => {
    expect(resolveHeroHeadline({ ...DEFAULT_SETTINGS, heroHeadline: '   ' })).toBe('原神！！！启动！！！')
  })

  it('detects either a hero scope or a wrapper containing one', () => {
    const { scope } = mountHero('探索未至之境')
    const wrapper = document.createElement('div')
    wrapper.append(scope)

    expect(touchesHeroCopy(scope)).toBe(true)
    expect(touchesHeroCopy(wrapper)).toBe(true)
    expect(touchesHeroCopy(document.createElement('div'))).toBe(false)
    scope.remove()
  })
})
