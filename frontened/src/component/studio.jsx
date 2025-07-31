import { useRef, useState, useEffect } from 'react';
import Labels from './labels';
import { FaTrash, FaSave, FaTimes, FaPlus, FaMinus, FaExpand, FaCompress, FaUndo, FaRedo, FaMagic, FaStar, FaInfoCircle } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_API_URL;

const colors = [
  '#ef4444',
  '#0fa673ff',
  '#8b5cf6',
  '#ec4899',
  '#ffe119',
  '#14b8a6',
  '#3498db',
  '#e74c3c',
  '#FFB21D',
  '#9b59b6',
  '#34495e',
  '#f1c40f',
  '#7f8c8d',
  '#e6194b',
  '#3cb44b',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#bcf60c',
  '#fabebe',
  '#FF3838',
  '#FF9D97',
  '#FF701F',
  '#CFD231',
  '#48F90A',
  '#92CC17',
  '#3DDB86',
  '#1A9334',
  '#00C2FF'
]

function Studio({ user, folder }) {
  const [image, setImage] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [tempBox, setTempBox] = useState(null);
  const [activeBoxIndex, setActiveBoxIndex] = useState(null);
  const [scale, setScale] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [editLabelIndex, setEditLabelIndex] = useState(null);
  const [labelInput, setLabelInput] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [filename, setFilename] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ai_loading, setAi_loading] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Save state to history
  const saveToHistory = (currentBoxes) => {
    const newHistory = [...history.slice(0, historyIndex + 1), [...currentBoxes]];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo action
  const handleUndo = () => {
    if (historyIndex > 0) {
      setBoxes(history[historyIndex - 1]);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Redo action
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setBoxes(history[historyIndex + 1]);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Handle mouse drawing
  const handleMouseDown = (e) => {
    if (!image) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    // Check if clicked on an existing box
    const clickedBoxIndex = boxes.findIndex(box => 
      x >= box.x && x <= box.x + box.width && 
      y >= box.y && y <= box.y + box.height
    );
    
    if (clickedBoxIndex !== -1) {
      setActiveBoxIndex(clickedBoxIndex);
      return;
    }
    
    setStartPos({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !image) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = (e.clientX - rect.left) / scale;
    const endY = (e.clientY - rect.top) / scale;
    
    const x = Math.min(startPos.x, endX);
    const y = Math.min(startPos.y, endY);
    const width = Math.abs(endX - startPos.x);
    const height = Math.abs(endY - startPos.y);
    
    setTempBox({ x, y, width, height });
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const endX = (e.clientX - rect.left) / scale;
    const endY = (e.clientY - rect.top) / scale;
    
    const x = Math.min(startPos.x, endX);
    const y = Math.min(startPos.y, endY);
    const width = Math.abs(endX - startPos.x);
    const height = Math.abs(endY - startPos.y);
    
    if (width > 5 && height > 5) {
      const newBoxes = [...boxes, { x, y, width, height, label: 'New Label' }];
      setBoxes(newBoxes);
      setActiveBoxIndex(newBoxes.length - 1);
      setEditLabelIndex(newBoxes.length - 1);
      setLabelInput('New Label');
      saveToHistory(newBoxes);
    }
    
    setIsDrawing(false);
    setTempBox(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setScale(1);
        setFilename(file.name);
      };
      reader.readAsDataURL(file);
      setBoxes([]);
      setActiveBoxIndex(null);
      setHistory([]);
      setHistoryIndex(-1);

      const formData = new FormData();
      formData.append("file", file);
      console.log(file);

      try {
        const res = await fetch(`${apiUrl}/api/update/${user}`, {
          method: "PUT",
          body: formData,
        });
        const data = await res.json();
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  useEffect(() => {
    const get_image = async function(){
      try{
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/image/${user}`, {
          method: "GET",
        });
        const result = await res.json();
        if(res.ok){
          console.log(result);
          setImage(result.data.image);
          setScale(1);
          setBoxes(result.data.labels);
          setFilename(result.data.filename);
          setSelectedFolder(result.data.folder);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setLoading(false);
      }
    }

    get_image();
  }, [])

  const deleteBox = (index) => {
    const newBoxes = [...boxes];
    newBoxes.splice(index, 1);
    setBoxes(newBoxes);
    setActiveBoxIndex(null);
    saveToHistory(newBoxes);
  };

  const clearAll = () => {
    setBoxes([]);
    setActiveBoxIndex(null);
    saveToHistory([]);
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.1));
  };

  const resetZoom = () => {
    setScale(1);
  };

  const fitToScreen = () => {
    if (containerRef.current && imageSize.width > 0) {
      const containerWidth = containerRef.current.clientWidth - 40;
      const containerHeight = containerRef.current.clientHeight - 40;
      const scaleX = containerWidth / imageSize.width;
      const scaleY = containerHeight / imageSize.height;
      setScale(Math.min(scaleX, scaleY, 1));
    }
  };

  const handleLabelChange = (e) => {
    setLabelInput(e.target.value);
  };

  const saveLabel = (index) => {
    if (labelInput.trim() === '') return;
    
    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], label: labelInput };
    setBoxes(newBoxes);
    setEditLabelIndex(null);
    saveToHistory(newBoxes);
  };

  const moveBox = (index, dx, dy) => {
    const newBoxes = [...boxes];
    newBoxes[index] = { 
      ...newBoxes[index], 
      x: Math.max(0, newBoxes[index].x + dx),
      y: Math.max(0, newBoxes[index].y + dy)
    };
    setBoxes(newBoxes);
    saveToHistory(newBoxes);
  };

  const resizeBox = (index, dw, dh) => {
    const newBoxes = [...boxes];
    newBoxes[index] = { 
      ...newBoxes[index], 
      width: Math.max(10, newBoxes[index].width + dw),
      height: Math.max(10, newBoxes[index].height + dh)
    };
    setBoxes(newBoxes);
    saveToHistory(newBoxes);
  };

	function hexToRgba(hex, opacity = 1) {
    hex = hex.replace('#', '');
    if (hex.length === 8) {
      hex = hex.slice(0, 6);
    }
    if (hex.length !== 6) {
      throw new Error('Invalid hex color');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

	useEffect(() => {
		if (!image || !canvasRef.current || !imageRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const img = imageRef.current;

		const draw = () => {
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

			// Draw boxes
			boxes.forEach((box, index) => {
				const isActive = index === activeBoxIndex;
				const boxColor = isActive ? '#3b82f6' : colors[index % colors.length];
				const fillColor = isActive ? 'rgba(59, 130, 246, 0.2)' : hexToRgba(colors[index % colors.length], 0.3);

				// Fill with transparent color
				ctx.fillStyle = fillColor;
				ctx.fillRect(box.x, box.y, box.width, box.height);

				// Draw box border
				ctx.strokeStyle = boxColor;
				ctx.lineWidth = isActive ? 3 : 2;
				ctx.strokeRect(box.x, box.y, box.width, box.height);

				// Draw label
				ctx.fillStyle = boxColor; 
        ctx.fillRect(box.x, box.y - 22, 100, 20);

        ctx.fillStyle = '#000'; 
        ctx.font = 'bold 16px Arial';
        ctx.fillText(box.label, box.x + 4, box.y - 5);


				// Draw corner handles for active box
				if (isActive) {
					const cornerSize = 8;
					const positions = [
            { x: box.x - cornerSize / 2, y: box.y - cornerSize / 2 },
            { x: box.x + box.width - cornerSize / 2, y: box.y - cornerSize / 2 },
            { x: box.x - cornerSize / 2, y: box.y + box.height - cornerSize / 2 },
            { x: box.x + box.width - cornerSize / 2, y: box.y + box.height - cornerSize / 2 }
					];
					ctx.fillStyle = '#3b82f6';
					positions.forEach(pos => {
					ctx.fillRect(pos.x, pos.y, cornerSize, cornerSize);
					});
				}
			});


			// Draw temp box if drawing
			if (tempBox) {
        ctx.strokeStyle = '#1021b9ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(tempBox.x, tempBox.y, tempBox.width, tempBox.height);
        ctx.setLineDash([]);
			}
		};

		if (img.complete) {
			setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
			draw();
		} else {
			img.onload = () => {
			setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
			draw();
			};
		}
    
	}, [image, boxes, tempBox, activeBoxIndex]);

  const handle_close_image = async function(command){
    try {
      const res = await fetch(`${apiUrl}/api/update/${user}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });
      const data = await res.json();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  const handlePredict = async () => {
    try {
      setAi_loading(true);
      const res = await fetch(`https://imagemark-label.onrender.com/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: image }),
      });
      const data = await res.json();
      setBoxes(data.boxes);
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setAi_loading(false);
    }
  };

  return (
    <div className="h-full md:h-[93vh] w-full flex flex-col border border-slate-200 md:flex-row bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Left Panel - Image Canvas */}
      <div className="w-full flex flex-col md:border-r border-zinc-300 h-full overflow-auto">
        <div className="bg-white p-2 flex-1 flex flex-col">
          <div className="text-xs sm:text-[13px] flex flex-wrap gap-2 mb-4">
			
            <label className="flex items-center cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 rounded-lg text-center transition-colors">
              <span className="font-medium mr-2">Upload Image</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </label>
            
            {boxes.length > 0 && (
              <>
                <button 
                  onClick={() => {
                    clearAll();
                    handle_close_image({
                      labels: [],
                      folder: '',
                    });
                  }}
                  className="flex items-center bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-lg transition-colors"
                >
                  <FaTrash className="mr-2" />
                  Clear All
                </button>
                <button 
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className={`flex items-center py-1 px-4 rounded-lg transition-colors ${historyIndex <= 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
                >
                  <FaUndo className="" />
                  {/* Undo */}
                </button>
                <button 
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className={`flex items-center py-1 px-4 rounded-lg transition-colors ${historyIndex >= history.length - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
                >
                  <FaRedo className="" />
                  {/* Redo */}
                </button>
              </>
            )}

            {image && (
              <div className="text-sm bg-slate-100/90 backdrop-blur-sm rounded-lg shadow-sm p-1 flex items-center gap-2">
                <button 
                  onClick={zoomIn}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  title="Zoom In"
                >
                  <FaPlus className="text-gray-700" />
                </button>
                <button 
                  onClick={zoomOut}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  title="Zoom Out"
                >
                  <FaMinus className="text-gray-700" />
                </button>
                <button 
                  onClick={resetZoom}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                  title="Reset Zoom"
                >
                  {Math.round(scale * 100)}%
                </button>
                <button 
                  onClick={fitToScreen}
                  className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  title="Fit to Screen"
                >
                  <FaCompress className="text-gray-700" />
                </button>

              </div>
            )}

            {(image && imageRef.current) &&
              <div className='flex flex-row gap-2 flex items-center ml-auto'>
                <div className='h-full shadow-sm bg-slate-100 p-2 rounded'>
                  <span className='h-full flex items-center justify-center gap-1'>
                    <span>{imageRef.current.naturalWidth}</span>
                    <span>x</span>
                    <span>{imageRef.current.naturalHeight}</span>
                  </span>
                </div>
                <div className="flex justify-center">
                  {ai_loading ?
                    <div
                      className="text-sm flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-2 sm:px-5 py-2 rounded-lg shadow-md transition duration-300"
                    >
                      <FaMagic className="text-lg" />
                      Predicting...
                    </div>
                    :
                    <button
                      onClick={handlePredict}
                      className="text-sm flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-2 sm:px-4 py-2 rounded-lg shadow-md transition duration-300"
                    >
                      <FaMagic className="text-lg" />
                      Auto-Detect
                    </button>
                  }
                </div>
              </div>
            }
          </div>

          <div 
            ref={containerRef}
            className="h-full w-full border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 p-2 relative mt-auto"
          >
            {image &&
              <div 
                className='absolute -top-0 -right-0 z-10 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors'
                onClick={() => {
                  handle_close_image({
                      labels: [],
                      folder: '',
                      clearImage: true
                    });
                  setImage(null);
                  setBoxes([]);
                  setScale(1);
                  
                }}
              >
                <FaTimes className='text-white text-sm'/>
              </div>
            }

            <div className='h-full overflow-auto flex bg-slate-200 items-center justify-start'>
              {ai_loading &&
                <div className="absolute h-full z-50 inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                  <FaMagic className="text-yellow-400 text-5xl animate-pulse" />
                </div>
              }
              {image ? (
                <div className="relative w-[450px] h-[550px]" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                  <img
                    src={image}
                    alt="Uploaded"
                    ref={imageRef}
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
                    className="cursor-crosshair ovefflow-auto"
                  />
                  
                </div>
                ) : (
                  loading ?
                  <div className='w-full h-full flex flex-col gap-2 items-center justify-center p-4'>
                    <div className='w-fit h-fit p-5 rounded-full border-4 border-t-transparent border-slate-500 animate-spin'>
                    </div>
                    <p className="text-slate-500 font-medium">
                      Loading an image to get started
                    </p>
                  </div>
                  :
                  <div className="w-full text-center p-8">
                    <div className="text-6xl mb-4 text-slate-300">📷</div>
                    <p className="text-slate-500 font-medium">
                      Upload an image to get started
                    </p>
                  </div>
                
              )}
            </div>
          </div>

          {/* <div className='flex flex-row mt-2 w-full overflow-auto scrollbar-hide'>
            {boxes.map((i,index) => (
              <div key={index} className="shrink-0 px-2 py-1 border-2 border-r-0 last:border-r cursor-pointer" style={{color: colors[(index) % colors.length] , backgroundColor: hexToRgba(colors[(index) % colors.length], 0.3)}}>
                {i.label}
              </div>
            ))}
          </div> */}
          
          {/* <div className="mt-4 bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Instructions:
            </h3>
            <ul className="text-slate-600 text-sm space-y-1">
              <li>• Click and drag to create a bounding box</li>
              <li>• Click on existing boxes to select them</li>
              <li>• Use arrow keys to move selected boxes</li>
              <li>• Hold Shift + arrow keys to resize selected boxes</li>
              <li>• Double-click labels to edit them</li>
            </ul>
          </div> */}
        </div>
      </div>

      {/* Right Panel - Annotations */}
	<div className='w-full max-h-screen md:w-3/4 md:h-[93vh] flex flex-col overflow-auto'>
		<div className="h-full bg-white flex-1 flex flex-col overflow-auto">
			<div className="border-b sm:border-t md:border-t-0 border-zinc-300 px-4 py-2 flex justify-between items-center">
				<h2 className="text-xl font-bold text-slate-800">Annotations</h2>
				<div className="flex items-center gap-2">
					<span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-medium">
						{boxes.length} {boxes.length === 1 ? 'item' : 'items'}
					</span>
				</div>
			</div>
			
			<div className="h-full overflow-auto">
				<Labels 
					boxes={boxes} 
					activeIndex={activeBoxIndex}
					onSelect={setActiveBoxIndex}
					onDelete={deleteBox}
					onEdit={(index, label) => {
						setEditLabelIndex(index);
						setLabelInput(label);
					}}
          imgWidth={imageRef.current && imageRef.current.naturalWidth}
          imgHeight={imageRef.current && imageRef.current.naturalHeight}
          user={user}
          folder={folder}
          name={filename}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          colors={colors}
          hexToRgba={hexToRgba}
				/>
			</div>

        	{/* Box Controls */}
			{activeBoxIndex !== null && boxes[activeBoxIndex] && (
			<div className="border-t border-zinc-300 bg-white mt-2 p-2">
				<div className="flex justify-between items-center">
				<h3 className="font-bold text-lg text-slate-800">Edit Box</h3>
				<button 
					onClick={() => setActiveBoxIndex(null)}
					className="text-gray-500 hover:text-gray-700"
				>
					<FaTimes />
				</button>
				</div>
				
				{editLabelIndex === activeBoxIndex ? (
				<form className="flex items-center mb-4 mt-2"
          onSubmit={() => saveLabel(activeBoxIndex)}
        >
					<input
					type="text"
					value={labelInput}
					onChange={handleLabelChange}
					className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					autoFocus
					/>
					<button
            // onClick={() => saveLabel(activeBoxIndex)}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
            >
            Save
					</button>
				</form>
				) : (
					<div className="mb-4">
					<div className="flex items-center justify-between">
					<span className="font-medium">Label: {boxes[activeBoxIndex].label}</span>
					<button
						onClick={() => {
							setEditLabelIndex(activeBoxIndex);
							setLabelInput(boxes[activeBoxIndex].label);
						}}
						className="text-blue-600 hover:text-blue-800 text-sm"
						>
						Edit
					</button>
					</div>
				</div>
				)}
				
				<div className="grid grid-cols-2 gap-4">
				<div>
					<h4 className="text-sm font-medium text-gray-700 mb-2">Position</h4>
					<div className="flex gap-2">
					<button 
						onClick={() => moveBox(activeBoxIndex, -5, 0)}
						className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
					>
						←
					</button>
					<button 
						onClick={() => moveBox(activeBoxIndex, 0, -5)}
						className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
					>
						↑
					</button>
					<button 
						onClick={() => moveBox(activeBoxIndex, 0, 5)}
						className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
					>
						↓
					</button>
					<button 
						onClick={() => moveBox(activeBoxIndex, 5, 0)}
						className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
					>
						→
					</button>
					</div>
				</div>
				
				<div>
					<h4 className="text-sm font-medium text-gray-700 mb-2">Size</h4>
					<div className="flex gap-2">
					<button 
						onClick={() => resizeBox(activeBoxIndex, -5, 0)}
						className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
						>
						←
					</button>
					<button 
						onClick={() => resizeBox(activeBoxIndex, 0, -5)}
						className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
						>
						↑
					</button>
					<button 
						onClick={() => resizeBox(activeBoxIndex, 0, 5)}
						className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
						>
						↓
					</button>
					<button 
						onClick={() => resizeBox(activeBoxIndex, 5, 0)}
						className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
						>
						→
					</button>
					</div>
				</div>
				</div>
			</div>
			)}
		</div>
      </div>
    </div>
  );
}

export default Studio;