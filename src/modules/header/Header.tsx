import classNames from "classnames";
import React, { FC, useCallback, useState, useEffect, useRef } from "react";

import { FocusOn } from "react-focus-on";

import { CREATE_PATH } from "@app/const/const";
import { MaybeWithClassName } from "@app/helper/react/types";
import { useScatteredContinuousState } from "@app/hooks/use-continuous-state";
import { useControlPopUp } from "@app/hooks/use-control-popup";
import { UserInfo } from "@app/modules/header/ui/user-info";
import { Button, NavLink } from "@app/ui/button";
import { ExtendedLogo } from "@app/ui/icons/logo";
import { Toggle } from "@app/ui/icons/toggle";

import { useConnected } from "@app/web3/hooks/use-connected";

import { ConnectWalletModal } from "../connect-wallet-modal";

import styles from "./Header.module.scss";
import { MobileNavigation } from "./ui/mobile-navigation";
import { Navigation } from "./ui/navigation";

type HeaderType = {
	active: boolean;
};

export const HeaderView: FC<HeaderType & MaybeWithClassName> = ({ className, active }) => {
	const [mobileNavigationShown, setMobileNavigationVisibility] = useState(false);
	const mobileNavigation = useScatteredContinuousState(mobileNavigationShown, {
		timeout: 350,
	});
	const closeMobileNavigationDisplay = useCallback(() => setMobileNavigationVisibility(false), []);
	// toggle is bound to a visible state of button
	const toggleMobileNavigationDisplay = useCallback(
		() => setMobileNavigationVisibility(!mobileNavigation.present),
		[mobileNavigation.present]
	);

	// close mobile navigation on route change
	useEffect(() => {
		closeMobileNavigationDisplay();
	}, [closeMobileNavigationDisplay]);

	const toggleRef = useRef<HTMLButtonElement>(null);

	const { popUp, close, open } = useControlPopUp();

	return (
		<>
			<header className={classNames(className, styles.component)}>
				<div className={styles.wrapper}>
					<NavLink
						className={styles.logo}
						href="/"
						icon={<ExtendedLogo style={{ width: 170 }} />}
						variant="text"
						color="primary-black"
					>
						Home
					</NavLink>
					<Navigation className={styles.navigation} />
					<div className={styles.buttons}>
						<NavLink
							className={styles.create}
							href={CREATE_PATH}
							variant="outlined"
							size="medium"
							color="primary-white"
							rainbowHover
						>
							Create
						</NavLink>
						{active ? (
							<UserInfo />
						) : (
							<Button
								className={styles.create}
								variant="contained"
								size="medium"
								color="primary-black"
								onClick={open}
							>
								Connect Wallet
							</Button>
						)}
					</div>
					<button className={styles.toggle} onClick={toggleMobileNavigationDisplay} ref={toggleRef}>
						<Toggle />
						<span>{mobileNavigation.present ? "Close" : "Open"}</span>
					</button>
				</div>
				{mobileNavigation.defined && (
					<FocusOn
						autoFocus
						enabled={mobileNavigation.present}
						onEscapeKey={closeMobileNavigationDisplay}
						onClickOutside={closeMobileNavigationDisplay}
						shards={[toggleRef]}
					>
						<MobileNavigation
							className={classNames(
								styles.dropdown,
								mobileNavigation.defined && styles.visible,
								mobileNavigation.present && styles.animation
							)}
							sideEffect={<mobileNavigation.DefinePresent timeout={16} />}
							onClick={closeMobileNavigationDisplay}
						/>
					</FocusOn>
				)}
			</header>
			{popUp.defined ? <ConnectWalletModal control={popUp} close={close} /> : null}
		</>
	);
};

export const Header: FC<MaybeWithClassName> = () => {
	const active = useConnected();

	return <HeaderView active={active} />;
};
