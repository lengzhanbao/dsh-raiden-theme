import { DEFAULT_SETTINGS, PluginConfig, SETTINGS_NAMESPACE, RaidenSettingsSchema } from './config.js';
import { registerAssetRoute } from './assets/route.js';
import { loadRaidenSystemPrompt } from './prompt/loader.js';
import { injectBootRaiden } from './boot-raiden.js';
export const name = '@dsh-external/dsh-raiden-theme';
export const inject = ['webServer'];
export const Config = PluginConfig;
export { DEFAULT_SETTINGS, SETTINGS_NAMESPACE, loadRaidenSystemPrompt, RaidenSettingsSchema };
/** Host half serves plugin art and injects a pre-paint veil to avoid FOUC. */
export function apply(ctx) {
    ctx.effect(() => registerAssetRoute(ctx), 'dsh-raiden-theme: assets');
    ctx.inject(['webServer'], (webCtx) => {
        webCtx.effect(() => webCtx.webServer.tapIndex((html) => injectBootRaiden(html)), 'dsh-raiden-theme: boot veil');
    });
}
//# sourceMappingURL=index.js.map