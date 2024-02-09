import { useRef } from 'react';

import { RightSidebarProps } from '@/types/type';
import { modifyShape } from '@/lib/shapes';

import Text from './settings/Text';
import Color from './settings/Color';
import Export from './settings/Export';
import Dimensions from './settings/Dimensions';

const RightSidebar = ({
	elementAttributes,
	setElementAttributes,
	fabricRef,
	activeObjectRef,
	isEditingRef,
	syncShapeInStorage,
}: RightSidebarProps) => {
	const colorInputRef = useRef(null);
	const strokeInputRef = useRef(null);

	const handleInputChange = (property: string, value: string) => {
		if (!isEditingRef.current) isEditingRef.current = true;

		setElementAttributes((prev) => ({ ...prev, [property]: value }));

		modifyShape({
			canvas: fabricRef.current as fabric.Canvas,
			property,
			value,
			activeObjectRef,
			syncShapeInStorage,
		});
	};

	return (
		<section className=' min-w-[227px] h-full sticky right-0 flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 select-none max-sm:hidden'>
			<h3 className='pt-4 px-5 text-xs uppercase'>Design</h3>
			<span className='mt-3 px-5 pb-4 text-xs border-b border-primary-grey-200 text-primary-grey-300'>
				Make changes to canvas
			</span>

			<Dimensions
				isEditingRef={isEditingRef}
				width={elementAttributes.width}
				height={elementAttributes.height}
				handleInputChange={handleInputChange}
			/>
			<Text
				fontSize={elementAttributes.fontSize}
				fontFamily={elementAttributes.fontFamily}
				fontWeight={elementAttributes.fontWeight}
				handleInputChange={handleInputChange}
			/>
			<Color
				placeholder='color'
				attributeType='fill'
				inputRef={colorInputRef}
				attribute={elementAttributes.fill}
				handleInputChange={handleInputChange}
			/>
			<Color
				placeholder='stroke'
				attributeType='stroke'
				inputRef={strokeInputRef}
				attribute={elementAttributes.stroke}
				handleInputChange={handleInputChange}
			/>
			<Export />
		</section>
	);
};

export default RightSidebar;
