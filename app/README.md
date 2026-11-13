# React + Vite

## KTES setup

Maps, place search and the "near you" search use [MapTiler](https://www.maptiler.com/). Add your key to `app/.env` (it's gitignored):

```
MAPTILER_API=your_key_here
```

Vite exposes `MAPTILER_*` variables to the browser (see `envPrefix` in `vite.config.js`), so the key ships in the site's JavaScript. In the MapTiler dashboard, limit the key to your site's domains. Without a key the site still works, but maps and location features are hidden.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
