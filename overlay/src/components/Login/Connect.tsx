import React, { FC } from "react";
import styles from "./Login.module.scss";
import LOADER from '../../assets/svg/loader.svg';

export interface ConnectProps {
  logo?: string
  message?: string
	label: string
	onLogin: (e: any) => Promise<void>
	disabled?: boolean
  loading?: boolean
}
export const Connect: FC<ConnectProps> = (props: ConnectProps) => {
	const { logo, message, label, onLogin, disabled, loading } = props;
	return (
    <div className={styles.connect}>
      {logo && (<div className={styles.logo}>
        <img src={logo} alt="logo"/>
      </div>)}
      {message && (<div className={styles.message}>
        <p>{message}</p>
      </div>)}
      <button
        className={styles.buttonLogin}
        onClick={onLogin}
        disabled={disabled}
      >
        {loading ? <img src={LOADER} alt="loading"/> : label}
      </button>
    </div>
	);
};
