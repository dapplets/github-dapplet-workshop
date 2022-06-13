import React, { FC } from "react";
import styles from "./Login.module.scss";
import { Connect } from "./Connect";
import { Disconnect } from "./Disconnect";

export interface LoginProps {
  logo: string
	name: string
	avatar?: string
  message?:  string
  login: (e: any) => Promise<void>
	logout: (e: any) => Promise<void>
	disabled?: boolean
  loading?: boolean
}

export const Login: FC<LoginProps> = (props: LoginProps) => {
  const {
    logo,
    name,
    avatar,
    message,
    login,
    logout,
    disabled,
    loading,
  } = props;

	return (
		<div className={styles.wrapper}>
      {name === ''
        ? <Connect
          logo={logo}
          message={message}
          label='Connect'
          onLogin={login}
          disabled={disabled}
          loading={loading}
        />
        : <Disconnect
          avatar={avatar}
          name={name}
          onLogout={logout}
        />}
		</div>
	);
};
