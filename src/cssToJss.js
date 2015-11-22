import cssom from 'cssom';

function mapStyles(rule) {
  return Array.from(rule.style).reduce((style, key) => ({ ...style, [key]: rule.style[key] }), {});
}

function reduceKeyframeRules(rules, rule) {
  return {
    ...rules,
    [rule.keyText]: mapStyles(rule)
  };
}

function replaceSelector(cssRule, sel, options = {}) {
  const isPureClassName = /^[\.\w\-]+$/.test(sel);
  if (!isPureClassName) {
    let className = sel.match(/(\.?[\w\-]+)/)[1];
    const classNameRe = new RegExp(className.replace('.', '\\.'), 'g');
    if (options.named !== false) {
      className = className.replace(/^\./, '');
    }

    return [className, {
      [sel.replace(classNameRe, '&')]: mapStyles(cssRule)
    }];
  }

  return [ sel.replace(/^\./, ''), mapStyles(cssRule) ];
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
    if (cssRule.constructor.name === 'CSSMediaRule') {
      for (let media of Array.from(cssRule.media)) {
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
    } else if (cssRule.constructor.name === 'CSSKeyframesRule') {
      const keyframeKey = `@keyframes ${cssRule.name}`;
      result = {
        ...result,
        [keyframeKey]: cssRule.cssRules.reduce(reduceKeyframeRules, {})
      };
    }
  }

  return result;
}
