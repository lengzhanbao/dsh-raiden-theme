import type { RaidenAgentState } from './types';
export declare function resetStateAdapter(): void;
export declare function mapRuntimeState(input: unknown): RaidenAgentState;
export declare function mapDomSignals(signals: {
    activeConversation?: boolean;
    composerPhase?: string | null;
    streaming?: boolean;
    hasToolCall?: boolean;
    error?: boolean;
    success?: boolean;
}, onState: (s: RaidenAgentState) => void): RaidenAgentState;
export declare function debounceState(state: RaidenAgentState): RaidenAgentState;
