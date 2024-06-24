import { BlacketRoute, TopRightContent } from "#types/blacket/pages";
import Main from ".";

const BPPPage = {
    name: "BPP",
    path: "/bpp",
    title: "BPP | Blacket Rewrite",
    topRight: [TopRightContent.TOKENS],
    sidebar: true,
    background: true,
    dontUseBody: false,
    component: () => <Main />
};

export default BPPPage;