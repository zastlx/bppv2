import { pm } from "#index";
import { InternalsPlugin } from "#plugin/plugins/internals";
import { LinkProps } from "#types";
import { DashboardStyles } from "#types/blacket/styles";
import * as styles from "./index.module.css";


export default () => {
    const { blacketScope } = (pm.getPlugin("Internals") as InternalsPlugin);
    const PageHeader = blacketScope("be") as React.FC<{ children: React.ReactNode }>;
    const Link = blacketScope("t") as React.FC<LinkProps>;
    const dashboardStyles = (pm.getPlugin("Internals") as InternalsPlugin).styles.dashboard as DashboardStyles;

    const btns = [
        {
            icon: "fas fa-wand-magic-sparkles",
            text: "Plugins",
            link: "/bpp/plugins"
        },
        {
            icon: "fas fa-palette",
            text: "Themes",
            link: "/bpp/themes"
        },
        {
            icon: "fas fa-heart",
            text: "Credits",
            link: "/bpp/credits"
        }
    ];

    return (
        <>
            <PageHeader>Blacket++</PageHeader>

            <div className={styles.section}>
                <div style={{
                    height: "20vh"
                }} className={`${dashboardStyles.smallButtonContainer} ${styles.container}`}>
                    {
                        btns.map((btn, i) => (
                            <Link to={btn.link} className={dashboardStyles.topRightButton} key={i}>
                                <i className={btn.icon} />
                                <div>{btn.text}</div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </>
    );
};