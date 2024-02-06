import CursorSVG from '@/public/assets/CursorSVG';

type Props = {
	x: number;
	y: number;
	message: string;
	color: string;
};

const Cursor = ({ x, y, message, color }: Props) => {
	return (
		<div
			className='pointer-events-none absolute top-0 left-0'
			style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
		>
			<CursorSVG color={color} />

			{message && (
				<div
					className='absolute top-5 left-2 px-4 py-2 rounded-3xl'
					style={{ backgroundColor: color }}
				>
					<p className='text-white text-sm leading-relaxed whitespace-nowrap'>
						{message}
					</p>
				</div>
			)}
		</div>
	);
};

export default Cursor;
