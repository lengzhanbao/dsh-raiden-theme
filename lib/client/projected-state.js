import { ACTIVE_SELECTOR, BETTER_SIDEBAR_SELECTOR, CHAT_FLOW_SELECTOR, SETTINGS_DIALOG_SELECTOR, WORKSPACE_SELECTOR, } from './chrome-selectors';
export function startProjectedState(body) {
    const sync = () => {
        const conversationFlow = body.querySelector(`${ACTIVE_SELECTOR} ${CHAT_FLOW_SELECTOR}`) !== null;
        body.toggleAttribute('data-raiden-chat-active', conversationFlow);
        body.toggleAttribute('data-raiden-conversation-active', body.querySelector(ACTIVE_SELECTOR) !== null);
        body.toggleAttribute('data-raiden-workspace', body.querySelector(WORKSPACE_SELECTOR) !== null);
        body.toggleAttribute('data-raiden-better-sidebar-open', (() => {
            const panel = body.querySelector(BETTER_SIDEBAR_SELECTOR);
            if (!(panel instanceof HTMLElement))
                return false;
            if (body.hasAttribute('data-dsh-sidebar-collapsed'))
                return false;
            const box = panel.getBoundingClientRect();
            return box.height > 80 && box.width > 160 && box.width < window.innerWidth * 0.72;
        })());
        body.toggleAttribute('data-raiden-settings-open', body.querySelector(SETTINGS_DIALOG_SELECTOR) !== null);
        body.toggleAttribute('data-dsh-floating-panel-open', body.querySelector('[data-dsh-floating-panel]') !== null);
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(body, {
        attributes: true,
        attributeFilter: ['data-phase', 'data-chat-flow', 'data-dsh-better-sidebar', 'data-dsh-sidebar-collapsed'],
        childList: true,
        subtree: true,
    });
    return () => {
        observer.disconnect();
        body.removeAttribute('data-raiden-chat-active');
        body.removeAttribute('data-raiden-conversation-active');
        body.removeAttribute('data-raiden-workspace');
        body.removeAttribute('data-raiden-better-sidebar-open');
        body.removeAttribute('data-raiden-settings-open');
        body.removeAttribute('data-dsh-floating-panel-open');
    };
}
//# sourceMappingURL=projected-state.js.map