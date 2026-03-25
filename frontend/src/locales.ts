import LocalesUtils from './utils/locales-nl';
import {Translator} from './models/model-interfaces';

const {trans, routes} = LocalesUtils;

const translate: Translator = (key?: string, params: any = {}): string => {
  if (!key) {
    return '';
  }

  let str;
  if (key.indexOf('.') === -1) {
    str = trans[key];
  } else {
    str = key.split('.').reduce((o, i) => o[i], trans);
  }

  if (str === undefined) {
    return key;
  }

  if (str.indexOf('${}') !== -1) {
    return str.replace('${}', params);

  } if (typeof params === 'object') {
    Object.keys(params).forEach(paramKey => {
      str = str.replace(`\${${paramKey}}`, params[paramKey]);
    });
  }

  return str;
};

translate.reverseRoute = (baseRoute: string, translatedRoute: string): string => {
  let result;
  Object.keys(routes[baseRoute]).forEach(key => {
    const value = routes[baseRoute][key];
    if (value === translatedRoute) {
      result = key;
    }
  });
  return result;
};

translate.route = (routeName: string, params: any): string => {
  let route: string;
  if (routeName.indexOf('.') === -1) {
    route = routes[routeName];
  } else {
    route = routeName.split('.').reduce((o, i) => o[i], routes) as unknown as string;
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
