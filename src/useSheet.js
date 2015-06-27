import reactJss from 'react-jss';
import css from './css';

export default function useSheet(sheet) {
  return component => reactJss(css`${sheet}`)(component);
}
