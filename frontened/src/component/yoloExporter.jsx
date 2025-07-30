import React from 'react';
import { FaSave } from 'react-icons/fa';

const YoloExporter = ({ boxes, imgWidth, imgHeight }) => {
  const exportYolo = () => {
    if (!imgWidth || !imgHeight) {
      console.error("Image dimensions are required");
      return;
    }

    const yoloData = boxes.map((box) => {
      const x_center = (box.x + box.width / 2) / imgWidth;
      const y_center = (box.y + box.height / 2) / imgHeight;
      const width = box.width / imgWidth;
      const height = box.height / imgHeight;

      return `${box.label} ${x_center.toFixed(6)} ${y_center.toFixed(6)} ${width.toFixed(6)} ${height.toFixed(6)}`;
    }).join('\n');

    const blob = new Blob([yoloData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'annotations.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(boxes, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'annotations.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className='w-full text-white flex justify-between'>
		<p className="text-sm text-gray-600 flex items-center justify-center">
          {boxes.length} annotations ready to export.
        </p>
		<div className='flex flex-row gap-2'>
			<button onClick={exportYolo}
				className='px-2 bg-blue-600 rounded flex flex-row items-center gap-1 cursor-pointer'
			>
				<FaSave/> YOLO
			</button>
			<button onClick={exportJSON} 
				className='px-2 bg-green-600 rounded flex flex-row gap-1 items-center cursor-pointer'
			>
				<FaSave/> JSON
			</button>
		</div>
    </div>
  );
};

export default YoloExporter;
