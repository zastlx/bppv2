import { BlacketRoute, TopRightContent } from "#types/blacket/pages";
import Plugins from ".";

const BPPPage = {
    name: "BPPPlugins",
    path: "/bpp/plugins",
    title: "BPP Plugins | Blacket Rewrite",
    topRight: [TopRightContent.TOKENS],
    sidebar: true,
    background: true,
    dontUseBody: false,
    component: () => <Plugins />
};

export default BPPPage;