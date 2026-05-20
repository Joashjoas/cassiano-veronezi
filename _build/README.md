# Build do CSS (Tailwind compilado)

Esta LP usa **Tailwind compilado via CLI** + estilos próprios + @font-face, tudo
**inline** no `<style>` do `<head>` do `index.html` (zero render-blocking).

## Como recompilar (após adicionar/remover classes no index.html)

Na pasta do cliente (`cassiano-veronezi/`):

```bash
npx tailwindcss@3.4.17 -c _build/tailwind.config.js -i _build/input.css -o _build/styles.css --minify
```

Depois, **substitua o conteúdo** do `<style>` no `<head>` do `index.html` pelo
conteúdo de `_build/styles.css`.

## Arquivos
- `tailwind.config.js` — cores/fontes/shadow custom (espelha o config antigo do CDN)
- `input.css` — diretivas @tailwind + @font-face (fontes variáveis self-hosted) + estilos próprios

## Fontes
WOFF2 variáveis em `../fonts/` (Outfit 300–700, Plus Jakarta Sans 400–700),
subsets latin + latin-ext, `font-display: swap`. As latin têm `<link rel="preload">` no head.
