import type { RaidenAgentState } from '../state/types';
export interface StateViewOptions {
    onState: (state: RaidenAgentState) => void;
}
export declare function createStateObserver(options: StateViewOptions): MutationObserver;
export declare const STATE_LABELS: Record<RaidenAgentState, string>;
