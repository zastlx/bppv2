import { BPP } from "#index";
import { InternalsPlugin } from "#plugin/plugins/internals";
import { LinkProps } from "#types";
import { DashboardStyles } from "#types/blacket/styles";
import * as styles from "./plugins.module.css";

interface HeaderProps {
    text: React.ReactNode,
    icon: string
};

export default () => {
    const { blacketScope } = (BPP.pluginManager.getPlugin("Internals") as InternalsPlugin);
    const PageHeader = blacketScope("be") as React.FC<{ children: React.ReactNode }>;
    const Container = blacketScope("Lo") as React.FC<{ header: HeaderProps, children: React.ReactNode }>;
    const dashboardStyles = (BPP.pluginManager.getPlugin("Internals") as InternalsPlugin).styles.dashboard as DashboardStyles;

    const { useEffect, useState } = (BPP.pluginManager.getPlugin("Internals") as InternalsPlugin).vendors.normalized.React;

    const plugins = BPP.pluginManager.getPlugins();
    const [pluginStates, setPluginStates] = useState();

    return (
        <>
            <PageHeader>Blacket++</PageHeader>

            <div className={styles.section}>
                <div style={{
                    height: "20vh"
                }} className={`${dashboardStyles.smallButtonContainer} ${styles.container}`}>
                    {plugins.filter(x => x.name !== "Internals").map((x, i) => (
                        <Container header={{
                            text: x.name,
                            icon: "fa-solid fa-box"
                        }} key={i}>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "space-between",
                                height: "100%"
                            }}>
                                <span>{x.description}</span>
                                <div className={styles.toggleButton} onClick={() => {
                                    const plugin = BPP.pluginManager.getPlugin(x.name);

                                }} />
                            </div>
                        </Container>
                    ))}
                </div>
            </div>
        </>
    );
};