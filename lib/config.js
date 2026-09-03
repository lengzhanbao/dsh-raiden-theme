import z from 'schemastery';
/** Cordis plugin config — host has no tunables; UI prefs live in browser localStorage. */
export const PluginConfig = z.object({});
export const SETTINGS_NAMESPACE = 'raiden-theme';
const colorPreset = z.union([
    z.const('raiden-violet'),
    z.const('raiden-night'),
    z.const('raiden-sakura'),
    z.const('custom'),
]).default('raiden-violet');
const dynamicIntensity = z.union([
    z.const('low'),
    z.const('standard'),
    z.const('high'),
]).default('standard');
const motion = z.union([
    z.const('off'),
    z.const('standard'),
]).default('standard');
export const RaidenColorConfigSchema = z.object({
    preset: colorPreset,
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    surface: z.string(),
    text: z.string(),
    success: z.string(),
    warning: z.string(),
    error: z.string(),
    dynamicEnabled: z.boolean().default(true),
    dynamicIntensity,
});
export const RaidenSettingsSchema = z.object({
    schemaVersion: z.number().default(4),
    enabled: z.boolean().default(false),
    displayName: z.string().default('雷电将军'),
    subtitle: z.string().default('尘世七执政 · 永恒'),
    heroHeadline: z.string().default('原神！！！启动！！！'),
    avatar: z.union([z.const('default'), z.string()]).default('default'),
    portrait: z.union([z.const('default'), z.const('off'), z.string()]).default('default'),
    timePhaseEnabled: z.boolean().default(true),
    stateColorEnabled: z.boolean().default(true),
    motion,
    reducedMotion: z.boolean().default(false),
    veilOpacity: z.number().min(0).max(100).default(6),
    acrylicPercent: z.number().min(0).max(100).default(38),
    frameOpacity: z.number().min(0).max(100).default(42),
    panelOpacity: z.number().min(0).max(100).default(42),
    characterOpacity: z.number().min(0).max(100).default(100),
    showLeftCharacter: z.boolean().default(true),
    showRightCharacter: z.boolean().default(true),
    showMascot: z.boolean().default(false),
    showWorkspaceMascot: z.boolean().default(true),
    colors: RaidenColorConfigSchema,
});
export function parseRaidenSettings(value) {
    const resolved = RaidenSettingsSchema(value && typeof value === 'object' ? value : {});
    return {
        schemaVersion: 4,
        enabled: resolved.enabled,
        displayName: resolved.displayName,
        subtitle: resolved.subtitle,
        heroHeadline: resolved.heroHeadline,
        avatar: resolved.avatar,
        portrait: resolved.portrait,
        timePhaseEnabled: resolved.timePhaseEnabled,
        stateColorEnabled: resolved.stateColorEnabled,
        motion: resolved.motion,
        reducedMotion: resolved.reducedMotion,
        veilOpacity: resolved.veilOpacity,
        acrylicPercent: resolved.acrylicPercent,
        frameOpacity: resolved.frameOpacity,
        panelOpacity: resolved.panelOpacity,
        characterOpacity: resolved.characterOpacity,
        showLeftCharacter: resolved.showLeftCharacter,
        showRightCharacter: resolved.showRightCharacter,
        showMascot: resolved.showMascot,
        showWorkspaceMascot: resolved.showWorkspaceMascot,
        colors: {
            preset: resolved.colors.preset,
            primary: resolved.colors.primary,
            secondary: resolved.colors.secondary,
            accent: resolved.colors.accent,
            background: resolved.colors.background,
            surface: resolved.colors.surface,
            text: resolved.colors.text,
            success: resolved.colors.success,
            warning: resolved.colors.warning,
            error: resolved.colors.error,
            dynamicEnabled: resolved.colors.dynamicEnabled,
            dynamicIntensity: resolved.colors.dynamicIntensity,
        },
    };
}
export const DEFAULT_SETTINGS = parseRaidenSettings({});
/** @deprecated Use parseRaidenSettings — kept for older imports/tests. */
export const RaidenSettingsSchemaParser = { parse: parseRaidenSettings };
//# sourceMappingURL=config.js.map