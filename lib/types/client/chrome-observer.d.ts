import type { RaidenSettings } from '../state/types';
export interface ChromeObserverOptions {
    getSettings: () => RaidenSettings;
    onNodes?: (nodes: HTMLElement[]) => void;
    onSidebarChange?: () => void;
}
export declare function createChromeObserver(options: ChromeObserverOptions): {
    disconnect: () => void;
};
