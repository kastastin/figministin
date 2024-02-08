'use client';

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

import {
	initializeFabric,
	handleCanvasMouseDown,
	handleResize,
} from '@/lib/canvas';

import Navbar from '@/components/Navbar';
import Live from '@/components/Live';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';

export default function Page() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fabricRef = useRef<fabric.Canvas | null>(null);
	const shapeRef = useRef<fabric.Object | null>(null);
	const selectedShapeRef = useRef<string | null>('rectangle');
	const isDrawing = useRef(false);

	useEffect(() => {
		const canvas = initializeFabric({ canvasRef, fabricRef });

		canvas.on('mouse:down', (options) => {
			handleCanvasMouseDown({
				canvas,
				options,
				shapeRef,
				selectedShapeRef,
				isDrawing,
			});
		});

		window.addEventListener('resize', () => {
			handleResize({ fabricRef } as any);
		});
	}, []);

	return (
		<main className='h-screen overflow-hidden'>
			<Navbar />

			<section className='h-full flex flex-row'>
				<LeftSidebar />
				<Live canvasRef={canvasRef} />
				<RightSidebar />
			</section>
		</main>
	);
}
