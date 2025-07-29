import { useEffect, useState } from "react";

function Yolo({ file_data, labels }) {
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    if (file_data && file_data.img_height && file_data.img_width) {
      const imgH = parseFloat(file_data.img_height);
      const imgW = parseFloat(file_data.img_width);
      setHeight(imgH);
      setWidth(imgW);

      const yoloBoxes = file_data.labels.map((box, idx) => {
        const classId = labels.indexOf(box.label);
        const x_center = (box.x + box.width / 2) / imgW;
        const y_center = (box.y + box.height / 2) / imgH;
        const box_width = box.width / imgW;
        const box_height = box.height / imgH;

        return `${classId} ${x_center.toFixed(6)} ${y_center.toFixed(6)} ${box_width.toFixed(6)} ${box_height.toFixed(6)}`;
      });

      setBoxes(yoloBoxes);
    }
  }, [file_data]);

  return (
    <div className="w-full h-full md:border-l border-slate-200 mt-5 md:mt-0">
      <div className="h-full w-full">
        <p className="px-2 py-1 font-semibold border-t border-b md:border-t-0 border-slate-200">
          Yolo format
        </p>
        <div className="h-full p-2 text-sm font-mono overflow-auto">
          {boxes.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Yolo;
