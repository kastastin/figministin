import Image from 'next/image';

const Loader = () => (
	<div className='w-screen h-screen flex flex-col justify-center items-center gap-2'>
		<Image
			src='/assets/loader.gif'
			alt='loader'
			width={100}
			height={100}
			className='object-contain'
		/>
		<p className='text-sm font-bold text-primary-grey-300'>Loading...</p>
	</div>
);

export default Loader;
