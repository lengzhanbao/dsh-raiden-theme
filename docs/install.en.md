# Installation (end users)

One command — **no** git clone, **no** local `npm build`.

## Requirements

| Item | Requirement |
| --- | --- |
| Platform | [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) **Web** profile |
| DSH version | `0.1.0-rc.6` or newer |
| Other | `dsh web` works (default `http://127.0.0.1:3080`) |

Web UI only — not CLI or other profiles.

## Install (recommended)

```bash
dsh plugin --profile web add https://github.com/lengzhanbao/dsh-raiden-theme/releases/latest/download/dsh-external-dsh-raiden-theme-0.1.0.tgz
```

Pinned version:

```bash
dsh plugin --profile web add https://github.com/lengzhanbao/dsh-raiden-theme/releases/download/v0.1.0/dsh-external-dsh-raiden-theme-0.1.0.tgz
```

Then:

1. **Restart** `dsh web`
2. **Hard-refresh** the browser (Ctrl+F5)
3. **Settings → General → Raiden mode** — master switch **On**

Light/dark follows DSH: **Settings → Appearance**.

## Quick checklist

- [ ] Wallpaper and pink-gold chat frame visible
- [ ] Raiden sliders in **Settings → General**
- [ ] Readable chat text (dark ink in light mode, warm gold-pink white in dark)
- [ ] Settings dialog opens and is clickable

## Optional persona

Skin and voice are **independent**. For Raiden speaking style, select agent preset **「Raiden 雷电将军」**. See [usage.en.md](usage.en.md).

## Upgrade / uninstall

```bash
# upgrade
dsh plugin --profile web add https://github.com/lengzhanbao/dsh-raiden-theme/releases/latest/download/dsh-external-dsh-raiden-theme-0.1.0.tgz
dsh web

# remove
dsh plugin --profile web remove @dsh-external/dsh-raiden-theme
dsh web
```

## FAQ

**No visual change** — Web profile only; hard-refresh; enable Raiden mode; avoid multiple UI themes.

**DSH won't start / JSON error** — Never hand-edit `profiles/web/package.json`; use `dsh plugin add`.

**Hard to read text** — Raise **Background veil** (14–18%) or **Panel opacity** in Raiden settings.

**After DSH upgrade, layout off** — Install the latest theme Release and report your DSH version if needed.

## Maintainers

See [environment-baseline.md](environment-baseline.md) and `npm run install:release` for pack smoke tests.
