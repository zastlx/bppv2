import { BPP } from "#index";
import { InternalsPlugin } from "#plugin/plugins/internals";
import { LinkProps } from "#types";
import { DashboardStyles } from "#types/blacket/styles";
import * as styles from "./plugins.module.css";
import { useSettings } from "#hooks/settings";

interface HeaderProps {
    text: React.ReactNode,
    icon: string
};

export default () => {
    const { blacketScope } = (BPP.pluginManager.getPlugin("Internals") as InternalsPlugin);
    // https://github.com/BlacketPS/frontend/blob/c2aaaef6f8938f77ff46881fd2f04310220fe906/src/components/PageHeader/index.tsx#L5
    const PageHeader = blacketScope("Ye") as React.FC<{ children: React.ReactNode }>;
    // https://github.com/BlacketPS/frontend/blob/c2aaaef6f8938f77ff46881fd2f04310220fe906/src/views/Settings/components/SettingsContainer.tsx#L5
    const Container = blacketScope("js") as React.FC<{ header: HeaderProps, children: React.ReactNode }>;
    const dashboardStyles = (BPP.pluginManager.getPlugin("Internals") as InternalsPlugin).styles.dashboard as DashboardStyles;

    const { useEffect, useState } = BPP.vendorManager.getVendorByName("React");

    const navigate = BPP.vendorManager.getVendorByName("useNavigate");

    const settings = useSettings();

    const plugins = BPP.pluginManager.getPlugins();
    const [pluginStates, setPluginStates] = useState();

    return (
        <>
            <PageHeader>Blacket++</PageHeader>

            <div className={styles.section} style={{
                position: "relative"
            }}>
                <div className={`${dashboardStyles.topRightButton} ${styles.styledButton}`} onClick={() => {
                    navigate("/bpp");
                }}>
                    <i className="fas fa-arrow-left" style={{ fontSize: "40px " }} />
                </div>
                <div style={{
                    height: "20vh"
                }} className={`${dashboardStyles.smallButtonContainer} ${styles.container}`}>
                    {plugins.filter(x => x.name !== "Internals").map((x, i) => (
                        <Container header={{
                            text: x.name,
                            icon: "fa-solid fa-box",
                        }} key={i}>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                height: "100%",
                                width: "100%"
                            }}>
                                <span style={{
                                    flex: 1,
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    fontSize: "1.5rem"
                                }}>{x.description}</span>
                                <div className={styles.toggleButton} onClick={(e) => {
                                    const plugin = BPP.pluginManager.getPlugin(x.name);
                                    plugin.enabled = !plugin.enabled;
                                    if (plugin.enabled) {
                                        BPP.pluginManager.enablePlugin(plugin.name);
                                        if (!settings.exists("enabledPlugins")) {
                                            settings.set("enabledPlugins", [plugin.name]);
                                        } else if (!settings.get("enabledPlugins").includes(plugin.name)) {
                                            settings.set("enabledPlugins", [...settings.get("enabledPlugins"), plugin.name]);
                                        }
                                    }
                                    else {
                                        BPP.pluginManager.disablePlugin(plugin.name);
                                        settings.removeArrayItem("enabledPlugins", plugin.name);
                                    }
                                    e.currentTarget.classList.toggle(styles.active);
                                }} />
                            </div>
                        </Container>
                    ))}
                </div>
            </div>
        </>
    );
};