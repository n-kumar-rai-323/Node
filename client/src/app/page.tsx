import Image from "next/image";
import styles from './blog/styles.module.css'
export default function Home() {
  
  return (
    <div className={styles.main}>
      <button className={styles.btn}> Click me</button>
    </div>
  );
}
