import type { RaidenImageConfig, RaidenSettings } from '../state/types';
export declare function isNightScene(root?: HTMLElement): boolean;
export declare function resolveAvatarUrl(settings: RaidenSettings, custom?: RaidenImageConfig, night?: boolean): string;
export declare function resolvePortraitUrl(settings: RaidenSettings, custom?: RaidenImageConfig): string | null;
export declare function resolveBannerUrl(settings: RaidenSettings, custom?: RaidenImageConfig): string | null;
export declare function resolveWallpaperUrl(night: boolean): string;
export declare function resolvePortraitFallback(): string;
export declare function resolveFigureUrls(night: boolean): {
    left: string;
    right: string;
};
export declare function resolveQChromeUrls(settings: RaidenSettings): {
    face: string;
    send: string;
    stop: string;
    newSession: string;
    settings: string;
    brand: string;
    command: string;
};
