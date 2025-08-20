import React from 'react';
import styles from './Loading.module.css';
function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="spinner-border text-danger" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
    // <div className={styles.loader}></div>

  );
}

export default Loading;
