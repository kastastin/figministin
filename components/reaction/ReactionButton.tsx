type Props = {
	setReaction: (reaction: string) => void;
};

export default function ReactionSelector({ setReaction }: Props) {
	return (
		<div
			onPointerMove={(e) => e.stopPropagation()}
			className='absolute bottom-20 left-0 right-0 w-fit mx-auto px-2 rounded-full bg-white transform'
		>
			<ReactionButton reaction='👍' onSelect={setReaction} />
			<ReactionButton reaction='🔥' onSelect={setReaction} />
			<ReactionButton reaction='😍' onSelect={setReaction} />
			<ReactionButton reaction='👀' onSelect={setReaction} />
			<ReactionButton reaction='😱' onSelect={setReaction} />
			<ReactionButton reaction='🙁' onSelect={setReaction} />
		</div>
	);
}

function ReactionButton({
	reaction,
	onSelect,
}: {
	reaction: string;
	onSelect: (reaction: string) => void;
}) {
	return (
		<button
			className='transform select-none p-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none'
			onPointerDown={() => onSelect(reaction)}
		>
			{reaction}
		</button>
	);
}
