import { CursorChatProps, CursorMode } from '@/types/type';

import CursorSVG from '@/public/assets/CursorSVG';

const CursorChat = ({
	cursor,
	cursorState,
	setCursorState,
	updateMyPresence,
}: CursorChatProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateMyPresence({ message: e.target.value });
		setCursorState({
			mode: CursorMode.Chat,
			previousMessage: null,
			message: e.target.value,
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setCursorState({
				mode: CursorMode.Chat,
				previousMessage: cursorState.message,
				message: '',
			});
		} else if (e.key === 'Escape') {
			setCursorState({
				mode: CursorMode.Hidden,
			});
		}
	};

	return (
		<div
			className='absolute top-0 left-0'
			style={{
				transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
			}}
		>
			{cursorState.mode === CursorMode.Chat && (
				<>
					<CursorSVG color='#000' />

					<div
						onKeyUp={(e) => e.stopPropagation()}
						className='absolute left-2 top-5 px-4 py-2 rounded-[20px] bg-blue-500 text-white text-sm leading-relaxed'
					>
						{cursorState.previousMessage && (
							<div>{cursorState.previousMessage}</div>
						)}

						<input
							maxLength={50}
							autoFocus={true}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							value={cursorState.message}
							placeholder={
								cursorState.previousMessage ? '' : 'Type a message...'
							}
							className='w-60 border-none bg-transparent text-white placeholder-blue-300 outline-none z-10'
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default CursorChat;
