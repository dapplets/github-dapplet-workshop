import React, { FC, useState } from "react";
import styles from "./List.module.scss";
import EXTERNAL from '../../assets/svg/external-link.svg';
import { minimizeName, capitalized } from '../../utils';

export interface ItemProps {
  title: string
  accounts: string[]
  amount: number
  link: string
  logo: string
}

export const Item: FC<ItemProps> = (props: ItemProps) => {
  const { title, accounts, amount, link, logo } = props;
  const [isOpened, setIsOpened] = useState(false);

	return (
		<div className={styles.item}>
      <div className={styles.itemPrime}>
        {logo && <div className={styles.logo}><img src={logo} alt='logo'/></div>}
        <div className={styles.info} onClick={() => setIsOpened(!isOpened)}>
          <h2 className="base">{capitalized(title)}</h2>
          <h4 className="base">{amount} {accounts?.length.toString().endsWith('1') ? 'like' : 'likes'} {isOpened ? 'from' : ''}</h4>
        </div>
        <a className={styles.link} href={link} target='_top'>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className={styles.linkPath} d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path className={styles.linkPath} d="M15 3H21V9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path className={styles.linkPath} d="M10 14L21 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
      {isOpened && (<div className={styles.itemSecond}>
        {accounts.map((account, i) => <a key={i} href={`https://explorer.testnet.near.org/accounts/${account}`} target='_blank'>{minimizeName(account)}</a>)}
      </div>)}
		</div>
	);
};

export interface ListProps { }

export const List: FC<ListProps> = (props) => {
	return (
		<div className={styles.list}>
      {props.children}
		</div>
	);
};
