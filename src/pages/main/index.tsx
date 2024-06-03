import { pm } from "#index";
import { InternalsPlugin } from "#plugin/plugins/internals";
import * as styles from "./index.module.css";

export default () => {
    return (
        <>
            <div className={(pm.getPlugin("Internals") as InternalsPlugin).blacketScope("fn").wrapper}>
                <h1 className={styles.mainText}>rizz</h1>
            </div>
        </>
    );
};