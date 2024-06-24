export enum TopRightContent {
    TOKENS = "tokens"
}

export interface BlacketRoute {
    name: string,
    path: string,
    component: () => JSX.Element,
    title: string,
    description: string,
    background: boolean,
    // @ts-expect-error cba
    header: HeaderProps,
    sidebar: boolean,
    // @ts-expect-error idk
    topRight: string[TopRightContent],
    dontUseBody: boolean,
    pageHeader: string
}
