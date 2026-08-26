/** Pre-paint veil bootstrap — mirrors ui-theme/boot-theme.ts. */
export function injectBootRaiden(html) {
    const script = `<script>(() => { try { document.documentElement.setAttribute('data-dsh-raiden-theme',''); document.body?.setAttribute('data-dsh-raiden-theme',''); } catch {} })()</script>`;
    const body = /<body(?:\s[^>]*)?>/i.exec(html);
    if (body === null)
        return `${html}${script}`;
    const at = body.index + body[0].length;
    return `${html.slice(0, at)}${script}${html.slice(at)}`;
}
//# sourceMappingURL=boot-raiden.js.map