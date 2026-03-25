Front: React-Redux
==================

Port `5193` for the development backend is hardcoded in:  
`src/config.ts`

## Commands

```sh
bun start        # dev server (connects to localhost:5193 backend)
bun run build    # tsc + vite build
bun test         # jest
bun run lint     # eslint
bun run lint-fix # eslint --fix
bun run deploy   # build + gh-pages
```


## Bootstrap Breakpoints

[Available breakpoints](https://getbootstrap.com/docs/5.0/layout/breakpoints/#available-breakpoints)

```
screen-xs-min: 576px; /* Extra small screen / phone */
screen-sm-min: 768px; /* Small screen / tablet */
screen-md-min: 992px; /* Medium screen / desktop */
screen-lg-min: 1200px;/* Large screen / wide desktop */
screen-xl-min: 1400px;
```
