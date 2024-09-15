import { BPP } from "#index";
import { InternalsPlugin } from "#plugin/plugins/internals";
import { LinkProps } from "#types";
import { DashboardStyles } from "#types/blacket/styles";
import * as styles from "./main.module.css";


export default () => {
    const { blacketScope } = (BPP.pluginManager.getPlugin("Internals") as InternalsPlugin);
    const PageHeader = blacketScope("Ye") as React.FC<{ children: React.ReactNode }>;
    const Link = blacketScope("o") as React.FC<LinkProps>;
    const dashboardStyles = (BPP.pluginManager.getPlugin("Internals") as InternalsPlugin).styles.dashboard as DashboardStyles;

    const btns = [
        {
            icon: "fas fa-wand-magic-sparkles",
            text: "Plugins",
            link: "/bpp/plugins"
        },
        {
            icon: "fas fa-cog",
            text: "Settings",
            link: "/bpp/credits"
        },
        {
            icon: "fas fa-palette",
            text: "Themes",
            link: "/bpp/themes"
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
                            <Link to={btn.link} className={`${styles.topRightButton} ${styles.styledButton}`} key={i}>
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