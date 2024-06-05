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
    header: HeaderProps,
    sidebar: boolean,
    topRight: string[TopRightContent],
    dontUseBody: boolean,
    pageHeader: string
}
