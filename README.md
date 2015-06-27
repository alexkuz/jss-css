# jss-css

This is a convenience module for [JSS](https://github.com/jsstyles/jss) that converts CSS string into JSS module. It allows to describe style classes for components in a habitual and little less verbose way.

## Installation
```
npm i -S jss-css
```

## Examples

```
import css from 'jss-css/lib/css';
import useSheet from 'react-jss';

@useSheet(css`
  .cell {
    padding: 1rem;
  }

  .separator  ~ .separator {
    border-left: 1px solid #DDD;
  }
`)
class Cell extends Component {
  ...
}
```

or:

```
import useSheet from 'jss-css/lib/useSheet';

@useSheet(`
  .cell {
    padding: 1rem;
  }

  .separator  ~ .separator {
    border-left: 1px solid #DDD;
  }
`)
class Cell extends Component {
  ...
}
```

These css declarations will be converted into JSS object:

```
{
  'cell': {
    'padding': '1rem'
  },
 
  'separator': {
    '& ~ &': {
      'border-left': '1px solid #DDD'
    }
  }
}
```

(for the nested styles to work you'll need to use [jss-nested](https://github.com/jsstyles/jss-nested) plugin)

Also, if you are using [Babel](https://babeljs.io/), you can use this [Babel Plugin](https://github.com/alexkuz/babel-plugin-jss-css) to avoid runtime compilation (`/* jss-css */` comment is neccessary):

```
import useSheet from 'jss-css/lib/useSheet';

@useSheet(`
  /* jss-css */
  .cell {
    padding: 1rem;
  }

  .separator  ~ .separator {
    border-left: 1px solid #DDD;
  }
`)
class Cell extends Component {
  ...
}
```

**Note**: in this case, you cannot use variables in the template string (at least for now).
