import { isNightScene, resolveAvatarUrl, resolveFigureUrls, resolvePortraitFallback, resolveQChromeUrls, resolveWallpaperUrl, } from '../assets/resolve';
import { SKIN_OWNER } from './chrome-selectors';
import { veilBucket } from './settings-store';
const ROOT_ATTR = 'data-dsh-raiden-theme';
const Q_VARS = [
    '--raiden-q-face',
    '--raiden-q-send',
    '--raiden-q-stop',
    '--raiden-q-new',
    '--raiden-q-settings',
    '--raiden-q-brand',
    '--raiden-q-command',
];
function tagChrome(node, chrome) {
    node.dataset.skinOwner = SKIN_OWNER;
    node.dataset.skinChrome = chrome;
    node.setAttribute('aria-hidden', 'true');
    return node;
}
export function bindAssetFallback(image, fallbackSrc) {
    image.addEventListener('error', () => {
        const current = image.getAttribute('src') ?? '';
        if (fallbackSrc && current !== fallbackSrc) {
            delete image.dataset.raidenAssetError;
            image.src = fallbackSrc;
            return;
        }
        image.dataset.raidenAssetError = '';
    });
    image.addEventListener('load', () => {
        delete image.dataset.raidenAssetError;
    });
}
export function applyImageSrc(image, src) {
    delete image.dataset.raidenAssetError;
    if (image.getAttribute('src') === src)
        return;
    image.src = src;
}
function makeImage(src, character) {
    const image = document.createElement('img');
    image.dataset.skinOwner = SKIN_OWNER;
    image.dataset.raidenCharacter = character;
    image.alt = '';
    image.decoding = 'async';
    bindAssetFallback(image, resolvePortraitFallback());
    applyImageSrc(image, src);
    return image;
}
function makeMascot(src) {
    const image = document.createElement('img');
    image.dataset.skinOwner = SKIN_OWNER;
    image.dataset.raidenMascot = 'sidebar';
    image.alt = '';
    image.decoding = 'async';
    bindAssetFallback(image, resolvePortraitFallback());
    applyImageSrc(image, src);
    return image;
}
const Q_PRELOAD_TIMEOUT_MS = 12_000;
function preloadImage(url, timeoutMs = Q_PRELOAD_TIMEOUT_MS) {
    if (!url || url === 'none')
        return Promise.resolve(false);
    if (url.startsWith('data:image/'))
        return Promise.resolve(true);
    return new Promise((resolve) => {
        const image = new Image();
        let settled = false;
        const finish = (ok) => {
            if (settled)
                return;
            settled = true;
            window.clearTimeout(timer);
            resolve(ok);
        };
        const timer = window.setTimeout(() => finish(false), timeoutMs);
        image.onload = () => finish(true);
        image.onerror = () => finish(false);
        image.src = url;
    });
}
let qChromeEpoch = 0;
function applyQChromeVars(body, settings) {
    const epoch = ++qChromeEpoch;
    const q = resolveQChromeUrls(settings);
    const entries = [
        ['--raiden-q-face', q.face],
        ['--raiden-q-send', q.send],
        ['--raiden-q-stop', q.stop],
        ['--raiden-q-new', q.newSession],
        ['--raiden-q-settings', q.settings],
        ['--raiden-q-brand', q.brand],
        ['--raiden-q-command', q.command],
    ];
    body.removeAttribute('data-raiden-q-ready');
    for (const [key] of entries)
        body.style.setProperty(key, 'none');
    void Promise.all(entries.map(async ([key, url]) => {
        const ok = await preloadImage(url);
        if (epoch !== qChromeEpoch)
            return false;
        body.style.setProperty(key, ok ? `url("${url}")` : 'none');
        return ok;
    })).then((loaded) => {
        if (epoch !== qChromeEpoch)
            return;
        if (loaded.every(Boolean))
            body.setAttribute('data-raiden-q-ready', '');
    });
}
export function applyRootAttributes(body, settings, state) {
    if (!settings.enabled) {
        body.removeAttribute(ROOT_ATTR);
        body.removeAttribute('data-raiden-state');
        body.removeAttribute('data-raiden-preset');
        body.removeAttribute('data-dsh-raiden-intensity');
        body.removeAttribute('data-dsh-raiden-motion');
        body.removeAttribute('data-dsh-raiden-reduced-motion');
        body.removeAttribute('data-raiden-veil');
        body.removeAttribute('data-raiden-acrylic-percent');
        body.removeAttribute('data-raiden-frame-opacity');
        body.removeAttribute('data-raiden-panel-opacity');
        body.removeAttribute('data-raiden-character-opacity');
        body.removeAttribute('data-raiden-hide-left');
        body.removeAttribute('data-raiden-hide-right');
        body.removeAttribute('data-raiden-hide-mascot');
        body.removeAttribute('data-raiden-q-ready');
        clearOpacityVars(body);
        return;
    }
    body.setAttribute(ROOT_ATTR, '');
    body.setAttribute('data-raiden-state', state);
    body.setAttribute('data-raiden-preset', settings.colors.preset);
    body.setAttribute('data-dsh-raiden-intensity', settings.colors.dynamicIntensity);
    body.setAttribute('data-dsh-raiden-motion', settings.motion === 'off' ? 'off' : 'standard');
    body.setAttribute('data-dsh-raiden-reduced-motion', settings.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'true' : 'false');
    body.setAttribute('data-raiden-veil', veilBucket(settings));
    body.setAttribute('data-raiden-acrylic-percent', String(settings.acrylicPercent));
    body.setAttribute('data-raiden-frame-opacity', String(settings.frameOpacity));
    body.setAttribute('data-raiden-panel-opacity', String(settings.panelOpacity));
    body.setAttribute('data-raiden-character-opacity', String(settings.characterOpacity));
    applyOpacityVars(body, settings);
    body.toggleAttribute('data-raiden-hide-left', !settings.showLeftCharacter);
    body.toggleAttribute('data-raiden-hide-right', !settings.showRightCharacter);
    body.toggleAttribute('data-raiden-hide-mascot', !settings.showMascot);
    applyQChromeVars(body, settings);
}
export function syncStageArt(root = document.body, settings) {
    const night = isNightScene(root);
    const wallpaper = root.querySelector('[data-raiden-wallpaper]');
    const wallpaperUrl = resolveWallpaperUrl(night);
    if (wallpaper instanceof HTMLImageElement && wallpaperUrl)
        applyImageSrc(wallpaper, wallpaperUrl);
    const figures = resolveFigureUrls(night);
    const left = root.querySelector("[data-raiden-character='left']");
    const right = root.querySelector("[data-raiden-character='right']");
    const mascot = root.querySelector("[data-raiden-mascot='sidebar']");
    if (left instanceof HTMLImageElement)
        applyImageSrc(left, figures.left);
    if (right instanceof HTMLImageElement)
        applyImageSrc(right, figures.right);
    if (settings && mascot instanceof HTMLImageElement)
        applyImageSrc(mascot, resolveAvatarUrl(settings, undefined, night));
}
export function createCharacterStage(settings) {
    if (!settings.enabled)
        return null;
    const night = isNightScene();
    const stage = tagChrome(document.createElement('div'), 'character-stage');
    const wallpaperUrl = resolveWallpaperUrl(night);
    if (wallpaperUrl) {
        const wallpaper = document.createElement('img');
        wallpaper.dataset.skinOwner = SKIN_OWNER;
        wallpaper.dataset.raidenWallpaper = 'paper';
        wallpaper.alt = '';
        wallpaper.decoding = 'async';
        bindAssetFallback(wallpaper);
        applyImageSrc(wallpaper, wallpaperUrl);
        stage.append(wallpaper);
    }
    const veil = document.createElement('div');
    veil.dataset.skinOwner = SKIN_OWNER;
    veil.dataset.raidenVeil = 'curtain';
    stage.append(veil);
    if (settings.portrait !== 'off') {
        const figures = resolveFigureUrls(night);
        stage.append(makeImage(figures.left, 'left'), makeImage(figures.right, 'right'));
    }
    return stage;
}
export function createAtelierFrame() {
    const frame = tagChrome(document.createElement('div'), 'atelier-frame');
    const corners = document.createElement('span');
    corners.dataset.raidenFrameCorners = '';
    corners.setAttribute('aria-hidden', 'true');
    for (const corner of ['top-left', 'top-right', 'bottom-left', 'bottom-right']) {
        const node = document.createElement('span');
        node.dataset.raidenFrameCorner = corner;
        node.setAttribute('aria-hidden', 'true');
        corners.append(node);
    }
    const badge = document.createElement('span');
    badge.dataset.raidenFrameBadge = '';
    badge.setAttribute('aria-hidden', 'true');
    frame.append(corners, badge);
    return frame;
}
export function createStageCurtains() {
    const top = tagChrome(document.createElement('div'), 'raiden-top-curtain');
    const bottom = tagChrome(document.createElement('div'), 'raiden-bottom-curtain');
    return [top, bottom];
}
export function createSidebarTrim() {
    const trim = tagChrome(document.createElement('div'), 'sidebar-trim');
    for (const corner of ['top-left', 'top-right', 'bottom-right', 'bottom-left']) {
        const node = document.createElement('span');
        node.dataset.raidenSidebarCorner = corner;
        node.setAttribute('aria-hidden', 'true');
        trim.append(node);
    }
    for (const part of ['ribbon', 'swag']) {
        const node = document.createElement('span');
        node.dataset.raidenSidebarOrnament = part;
        node.setAttribute('aria-hidden', 'true');
        trim.append(node);
    }
    return trim;
}
export function createTrims() {
    return [...createStageCurtains(), createAtelierFrame(), createSidebarTrim()];
}
export function decorateSidebar(settings, sidebar) {
    if (sidebar.querySelector("[data-raiden-mascot='sidebar']"))
        return [];
    const inner = sidebar.querySelector(':scope > div');
    const host = inner instanceof HTMLElement ? inner : sidebar;
    const mascot = makeMascot(resolveAvatarUrl(settings, undefined, isNightScene()));
    host.prepend(mascot);
    return [mascot];
}
export function removeOwnedChrome(root = document) {
    root.querySelectorAll(`[data-skin-owner="${SKIN_OWNER}"]`).forEach((node) => node.remove());
}
const OPACITY_VARS = [
    '--raiden-frame-opacity',
    '--raiden-panel-opacity',
    '--raiden-veil-opacity',
    '--raiden-character-opacity',
    '--raiden-acrylic-percent',
];
function clearOpacityVars(body) {
    for (const key of OPACITY_VARS)
        body.style.removeProperty(key);
}
function applyOpacityVars(body, settings) {
    body.style.setProperty('--raiden-frame-opacity', String(settings.frameOpacity / 100));
    body.style.setProperty('--raiden-panel-opacity', String(settings.panelOpacity));
    body.style.setProperty('--raiden-veil-opacity', String(settings.veilOpacity / 100));
    body.style.setProperty('--raiden-character-opacity', String(settings.characterOpacity / 100));
    body.style.setProperty('--raiden-acrylic-percent', String(settings.acrylicPercent));
}
export const TAFFY_INLINE_STYLE_KEYS = [
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
];
//# sourceMappingURL=mount.js.map