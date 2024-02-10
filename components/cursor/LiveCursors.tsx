import { COLORS } from '@/constants';
import { useOthers } from '@/liveblocks.config';

import Cursor from './Cursor';

const LiveCursors = () => {
	const others = useOthers();

	return others.map(({ connectionId, presence }) => {
		if (!presence?.cursor) return null;

		return (
			<Cursor
				key={connectionId}
				x={presence.cursor.x}
				y={presence.cursor.y}
				message={presence.message || ''}
				color={COLORS[Number(connectionId) % COLORS.length]}
			/>
		);
	});
};

export default LiveCursors;
