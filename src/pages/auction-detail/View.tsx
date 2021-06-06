import { FC, ReactNode } from "react";

import { useConvertDate } from "@app/hooks/use-convert-data";
import { Currency } from "@app/modules/currency";
import { Timer } from "@app/modules/timer";
import { DisplayPoolInfoType } from "@app/pages/auction";
import { Button } from "@app/ui/button";
import { DescriptionList } from "@app/ui/description-list";
import { GutterBox } from "@app/ui/gutter-box";

import { ArrowBack } from "@app/ui/icons/arrow-back";
import { RightArrow } from "@app/ui/icons/arrow-right";
import { ProgressBar } from "@app/ui/progress-bar";
import { Status } from "@app/ui/status";
import { Caption, Heading1, Heading2 } from "@app/ui/typography";

import { walletConversion } from "@app/utils/convertWallet";

import { POOL_STATUS } from "@app/utils/pool";

import styles from "./View.module.scss";

type AuctionDetailViewType = {
	actionTitle: string;
	alert?: ReactNode;
	amount: number;
	limit?: number;
	openAt: number;
	closeAt: number;
	claimAt?: Date;
	onZero(): void;
	onBack(): void;
};

export const View: FC<DisplayPoolInfoType & AuctionDetailViewType> = ({
	id,
	name,
	alert,
	children,
	address,
	token,
	type,
	amount,
	currency,
	price,
	total,
	status,
	fill,
	onZero,
	openAt,
	closeAt,
	actionTitle,
	limit,
	claimAt,
	onBack,
}) => {
	const convertDate = useConvertDate();

	const TOKEN_INFORMATION = {
		"Contact address": walletConversion(address),
		"Token symbol": <Currency token={token} small />,
	};

	const AUCTION_INFORMATION = {
		"Pool type": type,
		"Auction amount": total.toFixed(2),
		"Auction currency": <Currency token={currency} small />,
		"Price per unit, $": price,
		"Allocation per Wallet": limit > 0 ? limit : "No",
		"Delay Unlocking Token": claimAt ? convertDate(new Date(claimAt), "long") : "No",
	};

	const STATUS: Record<POOL_STATUS, ReactNode> = {
		[POOL_STATUS.COMING]: <Timer timer={openAt} onZero={onZero} />,
		[POOL_STATUS.LIVE]: <Timer timer={closeAt} onZero={onZero} />,
		[POOL_STATUS.FILLED]: "Filled",
		[POOL_STATUS.CLOSED]: "Closed",
		[POOL_STATUS.ERROR]: "Error",
	};

	return (
		<section className={styles.component}>
			<GutterBox>
				<div className={styles.wrapper}>
					<div className={styles.navigation}>
						<Button
							variant="text"
							color="primary-black"
							onClick={onBack}
							iconBefore={
								<RightArrow style={{ width: 8, marginRight: 12, transform: "rotate(180deg)" }} />
							}
						>
							Go Back
						</Button>
						<Caption Component="span" weight="medium">
							#{id}
						</Caption>
					</div>
					<Heading1 className={styles.title}>{name}</Heading1>
					{alert && <div className={styles.alert}>{alert}</div>}
					<div className={styles.content}>
						<div className={styles.info}>
							<DescriptionList
								className={styles.list}
								title="Token Information"
								data={TOKEN_INFORMATION}
							/>
							<DescriptionList
								className={styles.list}
								title="Auction Information"
								data={AUCTION_INFORMATION}
							/>
							<div className={styles.progress}>
								<Caption Component="h3" className={styles.progressCaption} weight="medium">
									Auction progress
								</Caption>
								<Caption Component="span" weight="regular">
									{amount} {currency} / {total} {currency}
								</Caption>
								<ProgressBar className={styles.bar} status={status} fillInPercentage={fill} />
							</div>
						</div>
						<div className={styles.action}>
							<div className={styles.header}>
								<Heading2 className={styles.actionTitle}>{actionTitle}</Heading2>
								<Status status={status} captions={STATUS} />
							</div>
							<div className={styles.body}>{children}</div>
						</div>
					</div>
				</div>
			</GutterBox>
		</section>
	);
};
