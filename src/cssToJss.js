import mapValues from 'lodash/object/mapValues';
import cssom from 'cssom';

function getStyles(rule) {
  return mapValues(rule.style._importants, (val, key) => rule.style[key]);
}

function replaceSelector(cssRule, sel, options) {
  const isPureClassName = /^[\.\w\-]+$/.test(sel);
  if (!isPureClassName) {
    let className = sel.match(/(\.?[\w\-]+)/)[1];
    const classNameRe = new RegExp(className.replace('.', '\\.'), 'g');
    if (options.named !== false) {
      className = className.replace(/^\./, '');
    }

    return [className, {
      [sel.replace(classNameRe, '&')]: getStyles(cssRule)
    }];
  }

  return [ sel.replace(/^\./, ''), getStyles(cssRule) ];
}

export default function cssToJss(str, options) {
  const cssRules = cssom.parse(str).cssRules;

  let result = {};

  for (let cssRule of cssRules) {
    if (cssRule.selectorText) {
      for (let sel of (cssRule.selectorText.split(/\s*,\s*/))) {
        const [key, val] = replaceSelector(cssRule, sel, options);
        result = {
          ...result,
          [key]: { ...(result[key] || {}), ...val }
        };
      }
    }
  }

  for (let cssRule of cssRules) {
    if (cssRule.media) {
      for (let i = 0; i < cssRule.media.length; i++) {
        let media = cssRule.media[i];
        for (let subRule of cssRule.cssRules) {
          for (let sel of (subRule.selectorText.split(/\s*,\s*/))) {
            const [key, val] = replaceSelector(subRule, sel, options);
            const mediaKey = `@media ${media}`;
            result = {
              ...result,
              [mediaKey]: {
                ...(result[mediaKey] || {}),
                [key]: {
                  ...((result[mediaKey] || {})[key] || {}),
                  ...val
                }
              }
            };
          }
        }
      }
    }
  }

  return result;
}
