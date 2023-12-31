import { Point } from '../interfaces/canvasInterfaces';

// CANVAS
export const CANVAS_DIV_ID = 'canvasPlanner';

export const MOODBOARD_CANVAS_DIV_ID = 'moodboard-canvas';

export const CANVAS_WIDTH = 900;

export const CANVAS_HEIGHT = 700;

export const MOODBOARD_CANVAS_WIDTH = 1152;

export const MOODBOARD_CANVAS_HEIGHT = 936;

// ICON'S IMG
export const deleteIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjIuMywgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA0OCA0OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDggNDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT4KPHJlY3QgY2xhc3M9InN0MCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ii8+CjxwYXRoIGQ9Ik0xMi40LDM3LjdsLTIuMS0yLjFMMjEuOSwyNEwxMC40LDEyLjRsMi4xLTIuMUwyNCwyMS45bDExLjUtMTEuNmwyLjEsMi4xTDI2LjEsMjRsMTEuNiwxMS41bC0yLjEsMi4xTDI0LDI2LjFMMTIuNCwzNy43eiIKCS8+Cjwvc3ZnPgo=';

export const editIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjIuMywgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA0OCA0OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDggNDg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT4KPHJlY3QgY2xhc3M9InN0MCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ii8+CjxwYXRoIGQ9Ik02LjMsNDQuN2MtMC44LDAtMS41LTAuMy0yLjEtMC45Yy0wLjYtMC42LTAuOS0xLjMtMC45LTIuMXYtMzBjMC0wLjgsMC4zLTEuNSwwLjktMi4xQzQuOCw5LDUuNSw4LjcsNi4zLDguN2gyMC4ybC0zLDNINi4zCgl2MzBoMzBWMjQuM2wzLTN2MjAuNGMwLDAuOC0wLjMsMS41LTAuOSwyLjFjLTAuNiwwLjYtMS4zLDAuOS0yLjEsMC45SDYuM3ogTTMwLjQsOS4xbDIuMSwyLjFMMTguMywyNS40djQuM2g0LjJsMTQuMy0xNC4zbDIuMSwyLjEKCUwyMy44LDMyLjdoLTguNXYtOC41TDMwLjQsOS4xeiBNMzksMTcuNWwtOC42LTguNGw1LTVjMC42LTAuNiwxLjMtMC44LDIuMS0wLjhjMC44LDAsMS42LDAuMywyLjEsMC45bDQuMiw0LjMKCWMwLjYsMC42LDAuOSwxLjMsMC45LDIuMWMwLDAuOC0wLjMsMS41LTAuOSwyLjFMMzksMTcuNXoiLz4KPC9zdmc+Cg==';

export const rotateIcon =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjIuMywgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAyOSAyOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjkgMjk7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO30KCS5zdDF7Y2xpcC1wYXRoOnVybCgjU1ZHSURfMl8pO30KCS5zdDJ7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoyLjIzMDg7fQo8L3N0eWxlPgo8Zz4KCTxyZWN0IGNsYXNzPSJzdDAiIHdpZHRoPSIyOSIgaGVpZ2h0PSIyOSIvPgoJPGc+CgkJPGRlZnM+CgkJCTxyZWN0IGlkPSJTVkdJRF8xXyIgd2lkdGg9IjI5IiBoZWlnaHQ9IjI5Ii8+CgkJPC9kZWZzPgoJCTxjbGlwUGF0aCBpZD0iU1ZHSURfMl8iPgoJCQk8dXNlIHhsaW5rOmhyZWY9IiNTVkdJRF8xXyIgIHN0eWxlPSJvdmVyZmxvdzp2aXNpYmxlOyIvPgoJCTwvY2xpcFBhdGg+CgkJPGcgY2xhc3M9InN0MSI+CgkJCTxwYXRoIGQ9Ik0yMy40LDBsNC44LDcuOWgtOS43TDIzLjQsMHoiLz4KCQkJPHBhdGggZD0iTTAsMjMuNGw3LjktNC44djkuN0wwLDIzLjR6Ii8+CgkJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yMy40LDdjMCwxOC40LTE3LDE2LjctMTcsMTYuNyIvPgoJCTwvZz4KCTwvZz4KPC9nPgo8L3N2Zz4K';
export const transparentRotateIcon =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjkiIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyOSAyOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzMxXzE5Nzc0KSI+CjxwYXRoIGQ9Ik0yMy40MjQ2IDBMMjguMjU0MyA3Ljk0NzEySDE4LjU5NDhMMjMuNDI0NiAwWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTcuMzEzMjVlLTA3IDIzLjQyMzFMNy45NDcxMiAxOC41OTMzTDcuOTQ3MTIgMjguMjUyOEw3LjMxMzI1ZS0wNyAyMy40MjMxWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTIzLjQyMTkgNi45NzA3QzIzLjQyMTkgMjUuMzc0NiA2LjQxMjI2IDIzLjcwMTUgNi40MTIyNiAyMy43MDE1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIuMjMwNzciLz4KPC9nPgo8ZGVmcz4KPGNsaXBQYXRoIGlkPSJjbGlwMF8zMV8xOTc3NCI+CjxyZWN0IHdpZHRoPSIyOSIgaGVpZ2h0PSIyOSIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K';
export const arrowDownIcon =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDciIGhlaWdodD0iNTEiIHZpZXdCb3g9IjAgMCA0NyA1MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9InBhdGgtMS1pbnNpZGUtMV8zMV8xOTY5MSIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMCA1MC45MDcySDQ3VjAuOTA3MjI3SDBWNTAuOTA3MloiLz4KPC9tYXNrPgo8cGF0aCBkPSJNMCA1MC45MDcySDQ3VjAuOTA3MjI3SDBWNTAuOTA3MloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zMiAyNS44MTc0TDIzLjUgMzQuMzE3NEwxNSAyNS44MTc0IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxsaW5lIHgxPSIyMy41MTU2IiB5MT0iMzIuNzk3OSIgeDI9IjIzLjUxNTYiIHkyPSIxMi42NjE1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxwYXRoIGQ9Ik00NyAxLjkwNzIzSDBWLTAuMDkyNzczNEg0N1YxLjkwNzIzWiIgZmlsbD0iIzk3OTc5NyIgbWFzaz0idXJsKCNwYXRoLTEtaW5zaWRlLTFfMzFfMTk2OTEpIi8+Cjwvc3ZnPgo=';
export const arrowUpIcon =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxMDAwIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCAxMDAwIDEwMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8ZGVzYz5DcmVhdGVkIHdpdGggRmFicmljLmpzIDMuNS4wPC9kZXNjPgo8ZGVmcz4KPC9kZWZzPgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmZmZmIi8+CjxnIHRyYW5zZm9ybT0ibWF0cml4KC0xNy44MjUzIDAgMCAtMTcuODI1MyA1MDAuMDAwMyA1MDAuMDAwNCkiIGlkPSI4Mzk1MDQiPgo8ZyBzdHlsZT0iIiB2ZWN0b3ItZWZmZWN0PSJub24tc2NhbGluZy1zdHJva2UiPgoJCTxnIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgMCAwLjQwNzIpIj4KPHBhdGggc3R5bGU9InN0cm9rZTogbm9uZTsgc3Ryb2tlLXdpZHRoOiAxOyBzdHJva2UtZGFzaGFycmF5OiBub25lOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7IHN0cm9rZS1saW5lam9pbjogbWl0ZXI7IHN0cm9rZS1taXRlcmxpbWl0OiA0OyBpcy1jdXN0b20tZm9udDogbm9uZTsgZm9udC1maWxlLXVybDogbm9uZTsgZmlsbDogcmdiKDI1NSwyNTUsMjU1KTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyIgdHJhbnNmb3JtPSIgdHJhbnNsYXRlKC0yMy41LCAtMjUuOTA3MikiIGQ9Ik0gMCA1MC45MDcyIEggNDcgViAwLjkwNzIyNyBIIDAgViA1MC45MDcyIFoiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L2c+CgkJPGcgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAwIDQuNTY3NCkiPgo8cGF0aCBzdHlsZT0ic3Ryb2tlOiByZ2IoMCwwLDApOyBzdHJva2Utd2lkdGg6IDEuNTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kOyBzdHJva2UtZGFzaG9mZnNldDogMDsgc3Ryb2tlLWxpbmVqb2luOiByb3VuZDsgc3Ryb2tlLW1pdGVybGltaXQ6IDQ7IGlzLWN1c3RvbS1mb250OiBub25lOyBmb250LWZpbGUtdXJsOiBub25lOyBmaWxsOiBub25lOyBmaWxsLXJ1bGU6IG5vbnplcm87IG9wYWNpdHk6IDE7IiB0cmFuc2Zvcm09IiB0cmFuc2xhdGUoLTIzLjUsIC0zMC4wNjc0KSIgZD0iTSAzMiAyNS44MTc0IEwgMjMuNSAzNC4zMTc0IEwgMTUgMjUuODE3NCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjwvZz4KCQk8ZyB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAxIDAuMDE1NiAtMi43NzAzKSI+CjxsaW5lIHN0eWxlPSJzdHJva2U6IHJnYigwLDAsMCk7IHN0cm9rZS13aWR0aDogMS41OyBzdHJva2UtZGFzaGFycmF5OiBub25lOyBzdHJva2UtbGluZWNhcDogcm91bmQ7IHN0cm9rZS1kYXNob2Zmc2V0OiAwOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgaXMtY3VzdG9tLWZvbnQ6IG5vbmU7IGZvbnQtZmlsZS11cmw6IG5vbmU7IGZpbGw6IG5vbmU7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHgxPSIwIiB5MT0iMTAuMDY4MiIgeDI9IjAiIHkyPSItMTAuMDY4MiIvPgo8L2c+CgkJPGcgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAwIC0yNC41OTI4KSI+CjxwYXRoIHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1kYXNob2Zmc2V0OiAwOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgaXMtY3VzdG9tLWZvbnQ6IG5vbmU7IGZvbnQtZmlsZS11cmw6IG5vbmU7IGZpbGw6IHJnYigxNTEsMTUxLDE1MSk7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHRyYW5zZm9ybT0iIHRyYW5zbGF0ZSgtMjMuNSwgLTAuOTA3MikiIGQ9Ik0gNDcgMS45MDcyMyBIIDAgViAtMC4wOTI3NzM0IEggNDcgViAxLjkwNzIzIFoiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L2c+CjwvZz4KPC9nPgo8L3N2Zz4=';
export const threeDotIcon =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCA1NiAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTQiIGN5PSIxNCIgcj0iNCIgZmlsbD0iYmxhY2siLz4KPGNpcmNsZSBjeD0iMjgiIGN5PSIxNCIgcj0iNCIgZmlsbD0iYmxhY2siLz4KPGNpcmNsZSBjeD0iNDIiIGN5PSIxNCIgcj0iNCIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==';

export const initPerimeter: Point[] = [
  {
    x: -200,
    y: -200,
    typeWall: 'rectWall',
    location: 0
  },
  {
    x: 200,
    y: -200,
    typeWall: 'rectWall',
    location: 1
  },
  {
    x: 200,
    y: 200,
    typeWall: 'rectWall',
    location: 2
  },
  {
    x: -200,
    y: 200,
    typeWall: 'rectWall',
    location: 3
  }
];
