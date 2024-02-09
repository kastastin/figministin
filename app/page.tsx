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
import { defaultNavElement } from '@/constants';
import { useStorage, useMutation, useUndo, useRedo } from '@/liveblocks.config';
import { handleDelete, handleKeyDown } from '@/lib/key-events';

import Navbar from '@/components/Navbar';
import Live from '@/components/Live';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import { handleImageUpload } from '@/lib/shapes';

export default function Page() {
	const undo = useUndo();
	const redo = useRedo();

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fabricRef = useRef<fabric.Canvas | null>(null);
	const shapeRef = useRef<fabric.Object | null>(null);
	const activeObjectRef = useRef<fabric.Object | null>(null);
	const selectedShapeRef = useRef<string | null>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);
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

	const deleteAllShapes = useMutation(({ storage }) => {
		const canvasObjects = storage.get('canvasObjects');

		if (!canvasObjects || canvasObjects.size === 0) return true;

		for (const [key, value] of canvasObjects.entries()) {
			canvasObjects.delete(key);
		}

		// return true if the store is empty
		return canvasObjects.size === 0;
	}, []);

	const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
		const canvasObjects = storage.get('canvasObjects');
		canvasObjects.delete(shapeId);
	}, []);

	const handleActiveElement = (elem: ActiveElement) => {
		setActiveElement(elem);

		switch (elem?.value) {
			case 'reset':
				deleteAllShapes();
				fabricRef.current?.clear();
				setActiveElement(defaultNavElement);
				break;

			case 'delete':
				handleDelete(fabricRef.current as any, deleteShapeFromStorage);
				setActiveElement(defaultNavElement);
				break;

			case 'image':
				imageInputRef.current?.click();
				isDrawing.current = false;

				if (fabricRef.current) fabricRef.current.isDrawingMode = false;
				break;

			default:
				break;
		}

		selectedShapeRef.current = elem?.value as string;
	};

	useEffect(() => {
		const canvas = initializeFabric({ canvasRef, fabricRef });

		canvas.on('mouse:down', (options: any) => {
			handleCanvasMouseDown({
				canvas,
				options,
				shapeRef,
				selectedShapeRef,
				isDrawing,
			});
		});

		canvas.on('mouse:move', (options: any) => {
			handleCanvaseMouseMove({
				canvas,
				options,
				shapeRef,
				selectedShapeRef,
				isDrawing,
				syncShapeInStorage,
			});
		});

		canvas.on('mouse:up', () => {
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

		canvas.on('object:modified', (options: any) => {
			handleCanvasObjectModified({
				options,
				syncShapeInStorage,
			});
		});

		window.addEventListener('resize', () => {
			handleResize({ fabricRef } as any);
		});

		window.addEventListener('keydown', (e: any) => {
			handleKeyDown({
				e,
				canvas: fabricRef.current,
				undo,
				redo,
				syncShapeInStorage,
				deleteShapeFromStorage,
			});
		});

		return () => {
			canvas.dispose();
		};
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
				imageInputRef={imageInputRef}
				handleImageUpload={(e: any) => {
					e.stopPropagation();

					handleImageUpload({
						file: e.target.files[0],
						canvas: fabricRef as any,
						shapeRef,
						syncShapeInStorage,
					});
				}}
			/>

			<section className='h-full flex flex-row'>
				<LeftSidebar allShapes={Array.from(canvasObjects)} />
				<Live canvasRef={canvasRef} />
				<RightSidebar />
			</section>
		</main>
	);
}

// history list order of all added elements
