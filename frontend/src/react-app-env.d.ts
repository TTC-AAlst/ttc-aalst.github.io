// https://github.com/JedWatson/classnames/blob/main/index.d.ts
declare module 'classnames' {
  type Value = string | number | null | undefined | boolean;
  type Mapping = Record<string, boolean | undefined>;
  type ArgumentArray = Array<Value | Mapping | ArgumentArray>;

  export default function classNames(...args: ArgumentArray): string;
}
