import React, { FC } from "react";
import styles from "./Profile.module.scss";
import cn from "classnames";
import { Avatar } from "../Avatar";
import Down from "../../assets/icons/down.svg";
import Up from "../../assets/icons/up.svg";

export interface ProfileProps {
	avatar: string;
	name: string;
	isOpen?: boolean;
	openClose?: () => void;
	onLogout?: () => void;
	mini?: boolean;
}

export const Profile: FC<ProfileProps> = (props: ProfileProps) => {
	const { avatar, name, isOpen, onLogout, openClose, mini = false } = props;

	const visible = (name: string): string => {
    if (!name) return '';
    if (name.length <  18) return name;
		const firstFourCharacters = name.substring(0, 6);
		const lastFourCharacters = name.substring(name.length - 1, name.length - 5);

		return `${firstFourCharacters}...${lastFourCharacters}`;
	};

	return (
		<div className={styles.wrapper}>
			<header className={cn(styles.header, { [styles.mini]: mini })} onClick={openClose}>
				<Avatar avatar={avatar} size="big" className={styles.avatar} />
				{!mini && <p className={styles.name}>{visible(name)}</p>}
				{!mini && isOpen ? <img src={Up} alt="Up arrow" /> : <img src={Down} alt="Down arrow" />}
			</header>
			{isOpen && !mini && (
				<ul
					className={cn(styles.list, {
						[styles.isOpen]: isOpen,
					})}
				>
					<li onClick={onLogout} className={styles.item}>
						Log out
					</li>
				</ul>
			)}
		</div>
	);
};
