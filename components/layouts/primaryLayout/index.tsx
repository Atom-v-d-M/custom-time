import React, { ReactNode } from "react";
import styles from "./index.module.scss";

export default function PrimaryLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <main className={styles.primaryLayout}>{children}</main>
    );
}
