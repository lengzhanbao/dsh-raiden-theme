import type { Context } from '@deepseek-ai/cordis';
import { DEFAULT_SETTINGS, SETTINGS_NAMESPACE, RaidenSettingsSchema } from './config.js';
import { loadRaidenSystemPrompt } from './prompt/loader.js';
export declare const name = "@dsh-external/dsh-raiden-theme";
export declare const inject: string[];
export declare const Config: import("@deepseek-ai/schemastery").default<Schemastery.ObjectS<{}>, Schemastery.ObjectT<{}>>;
export type HostConfig = Record<string, never>;
export { DEFAULT_SETTINGS, SETTINGS_NAMESPACE, loadRaidenSystemPrompt, RaidenSettingsSchema };
/** Host half serves plugin art and injects a pre-paint veil to avoid FOUC. */
export declare function apply(ctx: Context): void;
