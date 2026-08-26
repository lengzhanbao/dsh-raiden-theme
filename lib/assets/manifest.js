export const PLUGIN_ASSET_ROUTE_PREFIX = '/plugins/@dsh-external/dsh-raiden-theme/assets';
export const PLUGIN_ASSET_BASE = `${PLUGIN_ASSET_ROUTE_PREFIX}/raiden`;
/** Bumped when shipped art changes so browsers skip the 24h asset cache. */
export const ASSET_SET_VERSION = '2026-08-22-fill-q';
export function buildAssetUrl(relativePath) {
    const clean = relativePath.replace(/^\/+/, '');
    return `${PLUGIN_ASSET_BASE}/${clean}?v=${ASSET_SET_VERSION}`;
}
//# sourceMappingURL=manifest.js.map