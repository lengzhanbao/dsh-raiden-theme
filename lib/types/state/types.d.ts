import type { RaidenColorConfig, RaidenSettings } from '../config.js';
export type { RaidenColorConfig, RaidenSettings };
export type RaidenAgentState = 'idle' | 'thinking' | 'tool-calling' | 'streaming' | 'success' | 'error';
export type RaidenColorPreset = RaidenColorConfig['preset'];
export interface RaidenImageConfig {
    avatar?: string;
    portrait?: string;
    banner?: string;
    stateImages?: Partial<Record<RaidenAgentState, string>>;
}
export type TimePhase = 'morning' | 'afternoon' | 'evening' | 'night';
