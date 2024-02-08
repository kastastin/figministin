import Image from 'next/image';

import styles from './Avatar.module.css';

const IMAGE_SIZE = 48;

export function Avatar({
	name,
	otherStyles,
}: {
	name: string;
	otherStyles: string;
}) {
	return (
		<div
			className={`${styles.avatar} ${otherStyles} w-9 h-9`}
			data-tooltip={name}
		>
			<Image
				src={`https://liveblocks.io/avatars/avatar-${Math.floor(
					Math.random() * 30
				)}.png`}
				fill
				alt={name}
				className={styles.avatar_picture}
			/>
		</div>
	);
}
