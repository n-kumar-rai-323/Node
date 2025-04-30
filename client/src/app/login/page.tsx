import React from "react";
import styles from "../blog/styles.module.css";
import Image from "next/image";
const page = () => {
  return (
    <div>
      <form className={styles.formStyl}>
        <input className={styles.userInput} type="text" placeholder="name@mail.com"/><br/>
      <button className={styles.btn}> Click me</button>
      </form>
    </div>
  );
};

export default page;
