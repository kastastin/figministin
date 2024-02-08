'use client';

import Navbar from '@/components/Navbar';
import Live from '@/components/Live';

export default function Page() {
	return (
		<main className='h-screen overflow-hidden'>
			<Navbar />

			<section className='h-full flex flex-row'>
				<Live />
			</section>
		</main>
	);
}
