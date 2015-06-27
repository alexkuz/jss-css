var cssToJss = require('./cssToJss');

export default function css(strings, ...values) {
  const str = String.raw(strings, ...values);

  return cssToJss(str);
}
