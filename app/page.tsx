'use client';

import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

import {
	initializeFabric,
	handleResize,
	renderCanvas,
	handleCanvasMouseUp,
	handleCanvasMouseDown,
	handleCanvaseMouseMove,
	handleCanvasObjectModified,
} from '@/lib/canvas';

import { ActiveElement } from '@/types/type';
import { useStorage, useMutation } from '@/liveblocks.config';

import Navbar from '@/components/Navbar';
import Live from '@/components/Live';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';

export default function Page() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fabricRef = useRef<fabric.Canvas | null>(null);
	const shapeRef = useRef<fabric.Object | null>(null);
	const activeObjectRef = useRef<fabric.Object | null>(null);
	const selectedShapeRef = useRef<string | null>('rectangle');
	const isDrawing = useRef(false);

	const canvasObjects = useStorage((root) => root.canvasObjects);

	const syncShapeInStorage = useMutation(({ storage }, object) => {
		if (!object) return;

		const { objectId } = object;

		const shapeData = object.toJSON();
		shapeData.objectId = objectId;

		const canvasObjects = storage.get('canvasObjects');
		canvasObjects.set(objectId, shapeData);
	}, []);

	const [activeElement, setActiveElement] = useState<ActiveElement>({
		name: '',
		value: '',
		icon: '',
	});

	const handleActiveElement = (elem: ActiveElement) => {
		setActiveElement(elem);

		selectedShapeRef.current = elem?.value as string;
	};

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

		canvas.on('mouse:move', (options) => {
			handleCanvaseMouseMove({
				canvas,
				options,
				shapeRef,
				selectedShapeRef,
				isDrawing,
				syncShapeInStorage,
			});
		});

		canvas.on('mouse:up', (options) => {
			handleCanvasMouseUp({
				canvas,
				shapeRef,
				selectedShapeRef,
				isDrawing,
				syncShapeInStorage,
				setActiveElement,
				activeObjectRef,
			});
		});

		canvas.on('object:modified', (options) => {
			handleCanvasObjectModified({
				options,
				syncShapeInStorage,
			});
		});

		window.addEventListener('resize', () => {
			handleResize({ fabricRef } as any);
		});
	}, []);

	useEffect(() => {
		renderCanvas({
			fabricRef,
			canvasObjects,
			activeObjectRef,
		});
	}, [canvasObjects]);

	return (
		<main className='h-screen overflow-hidden'>
			<Navbar
				activeElement={activeElement}
				handleActiveElement={handleActiveElement}
			/>

			<section className='h-full flex flex-row'>
				<LeftSidebar />
				<Live canvasRef={canvasRef} />
				<RightSidebar />
			</section>
		</main>
	);
}
