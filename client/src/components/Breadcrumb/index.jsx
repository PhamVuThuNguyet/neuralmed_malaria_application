import styles from "../../styles/Breadcrumb/breadcrumb.module.scss"

export default function BreadCrumb({data}) {
  return <div className={styles.container}>{data}</div>
}