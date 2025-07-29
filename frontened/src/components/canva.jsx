import React, { useRef, useState, useEffect } from "react";

export default function Canva({ image }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [boxes, setBoxes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [tempBox, setTempBox] = useState(null);

  const getScaledCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return { x, y };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getScaledCoordinates(e);
    setStartPoint({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = getScaledCoordinates(e);
    const width = x - startPoint.x;
    const height = y - startPoint.y;
    setTempBox({ x: startPoint.x, y: startPoint.y, width, height });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !tempBox) return;
    setBoxes((prev) => [...prev, tempBox]);
    setTempBox(null);
    setIsDrawing(false);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;
    if (!ctx || !img) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    [...boxes, tempBox].forEach((box) => {
      if (!box) return;
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
    });
  };

  useEffect(() => {
    draw();
  }, [boxes, tempBox]);

  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    draw();
  };

  return (
    <div className="w-full overflow-auto">
      <img
        src={image}
        alt="Uploaded"
        ref={imageRef}
        onLoad={handleImageLoad}
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDrawing) {
            setIsDrawing(false);
            setTempBox(null);
          }
        }}
        className="cursor-crosshair w-full h-auto max-h-[80vh]"
      />
    </div>
  );
}
