import type { Variant } from 'unocss';
import {
  defineConfig,
  transformerDirectives,
  transformerVariantGroup,
  presetWind,
  presetUno,
  presetWebFonts,
  presetIcons,
  transformerCompileClass,
} from 'unocss';
import { theme } from './tailwind.config.cjs';

const createVariantSelector = (select: string, cb: (state: string, s: string) => string): Variant => (
  (matcher) => {
    if (!matcher.startsWith(select)) return matcher;

    const [variant, ...rest] = matcher.split(':');

    const state = variant.replace(select, '');

    return {
      selector: (s) => cb(state, s),
      matcher: rest.join(':'),
    };
  }
);

const createSimpleVarianl = (select: string, selector: (s: string) => string): Variant => (
  (matcher) => {
    if (!matcher.startsWith(select)) return matcher;

    return {
      matcher: matcher.slice(select.length),
      selector,
    };
  }
);

const config = defineConfig({
  // WebStorm don't support unocss config, so theme put in tailwind.config.cjs
  theme: {
    ...theme.extend,
  },
  rules: [
    ['content-fill', { content: '"\xa0"' }],
    ['c_', { content: '"\xa0"' }],
    [/^((min|max)-)?size-(\d+)(.+)?$/, ([matcher]) => {
      const [type, sizePart] = matcher.split('size-');
      const sizeNum = Number(sizePart);
      const createRes = (width: string, height?: string) => ({ [`${type}width`]: width, [`${type}height`]: height ?? width });

      if (sizeNum > 0) return createRes(`${sizeNum / 4}rem`);
      if (sizePart.endsWith('v')) return createRes(`${sizePart}w`, `${sizePart}h`);
      if (sizePart.includes('/')) {
        const [prev, suf] = sizePart.split('/');
        const percent = 100 * Number(prev) / Number(suf);
        return createRes(`${percent}%`);
      }

      return createRes(sizePart);
    }],
  ],
  variants: [
    createVariantSelector('deep-of-',  (state, s) => `${s} ${state}`),
    createVariantSelector('of-',  (state, s) => `${s}>${state}`),
    createVariantSelector('group-ui-',  (state, s) => `.group[data-headlessui-state*="${state}"] ${s}`),
    createVariantSelector('ui-',  (state, s) => `${s}[data-headlessui-state*="${state}"]`),
    createVariantSelector('noui-',  (state, s) => `${s}:not([data-headlessui-state*="${state}"])`),

    createSimpleVarianl('hocus:', (s) => `${s}:hover, ${s}:focus`),
    createSimpleVarianl('deep-children:', (s) => `${s} *`),

    // Match data and aria values
    (matcher) => {
      if (!['aria-', 'data-'].some((v) => matcher.startsWith(v))) return matcher;

      const [variant, ...rest] = matcher.split(':');

      const index = matcher.indexOf('[');
      const value = index != -1 ? matcher.slice(index + 1, matcher.indexOf(']')) : 'true';
      const selector = variant.replace(/-\[.+]$/, '');


      return {
        selector: (s) => `${s}[${selector}="${value}"]`,
        matcher: rest.join(':'),
      };
    },
    (matcher) => {
      if (!matcher.startsWith('max-')) return matcher;

      const [variant, ...rest] = matcher.split(':');

      const mediaPx = {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
      }[variant.replace('max-', '')];

      if (!mediaPx) return matcher;

      return {
        matcher: rest.join(':'),
        parent: `@media (max-width: ${mediaPx}px)`,
      };
    },
  ],
  presets: [
    presetUno(),
    presetWind(),
    presetWebFonts({
      fonts: {
        sans: 'Source Sans Pro',
      },
    }),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        height: 'auto',
        'min-height': '1em',
        'white-space': 'nowrap',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    transformerCompileClass(),
  ],
});

export default config;
