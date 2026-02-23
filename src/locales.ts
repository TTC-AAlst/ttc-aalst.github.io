import LocalesUtils from './utils/locales-nl';
import { Translator } from './models/model-interfaces';

const { trans, routes } = LocalesUtils;

const translate: Translator = (key?: string, params: Record<string, unknown> = {}): string => {
  if (!key) {
    return '';
  }

  let str: string | undefined;
  if (key.indexOf('.') === -1) {
    str = (trans as unknown as Record<string, string>)[key];
  } else {
    str = key
      .split('.')
      .reduce((o: Record<string, unknown>, i: string) => (o?.[i] as Record<string, unknown>) ?? {}, trans as Record<string, unknown>) as unknown as string;
  }

  if (str === undefined || typeof str !== 'string') {
    return key;
  }

  if (str.indexOf('${}') !== -1) {
    return str.replace('${}', String(params));
  }
  if (typeof params === 'object') {
    Object.keys(params).forEach(paramKey => {
      str = (str as string).replace(`\${${paramKey}}`, String(params[paramKey]));
    });
  }

  return str;
};

translate.reverseRoute = (baseRoute: string, translatedRoute: string): string => {
  let result: string | undefined;
  const routeObj = (routes as unknown as Record<string, Record<string, string>>)[baseRoute];
  Object.keys(routeObj).forEach(key => {
    const value = routeObj[key];
    if (value === translatedRoute) {
      result = key;
    }
  });
  return result ?? '';
};

translate.route = (routeName: string, params?: Record<string, string>): string => {
  let route: string;
  if (routeName.indexOf('.') === -1) {
    route = (routes as unknown as Record<string, string>)[routeName];
  } else {
    route = routeName
      .split('.')
      .reduce((o: Record<string, unknown>, i: string) => (o?.[i] as Record<string, unknown>) ?? {}, routes as Record<string, unknown>) as unknown as string;
  }

  if (!params) {
    return route;
  }

  Object.keys(params).forEach(paramKey => {
    route = route.replace(`:${paramKey}`, params[paramKey]);
  });
  return route;
};

export default translate;
export const t = translate;
