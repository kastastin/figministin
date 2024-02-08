'use client';

import Navbar from '@/components/Navbar';
import Live from '@/components/Live';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';

export default function Page() {
	return (
		<main className='h-screen overflow-hidden'>
			<Navbar />

			<section className='h-full flex flex-row'>
				<LeftSidebar />
				<Live />
				<RightSidebar />
			</section>
		</main>
	);
}
