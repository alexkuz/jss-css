import mapValues from 'lodash/object/mapValues';
import cssom from 'cssom';
import reduce from 'lodash/collection/reduce';

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
  const keyValues = [
    for (cssRule of cssom.parse(str).cssRules)
      for (sel of cssRule.selectorText.split(/\s*,\s*/))
        replaceSelector(cssRule, sel, options)
  ];

  return reduce(keyValues, (obj, keyVal) => ({
    ...obj,
    [keyVal[0]]: { ...(obj[keyVal[0]] || {}), ...keyVal[1] }
  }), {});
}