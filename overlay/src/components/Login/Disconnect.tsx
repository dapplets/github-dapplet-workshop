import React, { FC } from "react";
import styles from "./Login.module.scss";
import USER from '../../assets/svg/user.svg';
import LOGOUT from '../../assets/svg/logout.svg';
import { minimizeName } from '../../utils';
import cn from "classnames";

export interface DisconnectProps {
	avatar?: string
	name: string
	onLogout?: (e: any) => Promise<void>
}

export const Disconnect: FC<DisconnectProps> = (props: DisconnectProps) => {
	const { avatar = USER, name, onLogout } = props;

	return (
		<div className={styles.disconnect}>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar"/>
      </div>
      {name  && (<div className={cn(styles.name, name.length > 23 ? styles.h2 : styles.h1)}>
        <p>{minimizeName(name, 28)}</p>
      </div>)}
      <button className={styles.buttonLogout} onClick={onLogout}>
        <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle className={styles.buttonLogoutColorFill} cx="20" cy="20.5" r="17"/>
          <circle className={styles.buttonLogoutColorStroke} cx="20" cy="20.5" r="19.5"/>
          <path d="M17.826 27.7608H14.3478C13.8865 27.7608 13.4442 27.5776 13.118 27.2514C12.7919 26.9253 12.6086 26.4829 12.6086 26.0217V13.8478C12.6086 13.3865 12.7919 12.9442 13.118 12.618C13.4442 12.2919 13.8865 12.1086 14.3478 12.1086H17.826" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23.9131 24.2826L28.2609 19.9347L23.9131 15.5869" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M28.261 19.9348H17.8262" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
		</div>
	);
};
