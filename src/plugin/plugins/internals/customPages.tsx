import Main from "#pages/main";
import { BlacketRoute, TopRightContent } from "#types/blacket/pages.d";

const BPPPage: Partial<BlacketRoute> = {
    name: "BPP",
    path: "/bpp",
    title: "BPP | Blacket Rewrite",
    topRight: [TopRightContent.TOKENS],
    sidebar: true,
    background: true,
    dontUseBody: true,
    component: () => <Main />
};

export { BPPPage };