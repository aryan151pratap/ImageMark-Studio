import React, { useState, useRef, useEffect } from "react";

function ImageAugmentor() {
  const [originalImage, setOriginalImage] = useState(null);
  const [augmentedImages, setAugmentedImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  
  // Augmentation parameters with live preview
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [hue, setHue] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [sepia, setSepia] = useState(false);
  const [invert, setInvert] = useState(false);
  
  const [selectedAugmentation, setSelectedAugmentation] = useState("adjust");
  const [previewImage, setPreviewImage] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  
  const originalImageRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // Load original image
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setAugmentedImages([]);
        setSelectedAugmentation("adjust");
        resetSettings();
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset all settings to default
  const resetSettings = () => {
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setHue(0);
    setFlipH(false);
    setFlipV(false);
    setGrayscale(false);
    setSepia(false);
    setInvert(false);
  };

  // Generate preview when settings change
  useEffect(() => {
    if (!originalImage) return;
    
    setPreviewLoading(true);
    
    const timer = setTimeout(() => {
      generatePreview();
      setPreviewLoading(false);
    }, 150);
    
    return () => clearTimeout(timer);
  }, [
    originalImage, 
    rotation, 
    brightness, 
    contrast, 
    saturation, 
    blur, 
    hue, 
    flipH, 
    flipV,
    grayscale,
    sepia,
    invert
  ]);
  
  // Generate the preview image
  const generatePreview = () => {
    if (!originalImage || !previewCanvasRef.current) return;
    
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = originalImage;
    
    img.onload = () => {
      // Calculate canvas size based on rotation
      const radians = rotation * Math.PI / 180;
      const sin = Math.abs(Math.sin(radians));
      const cos = Math.abs(Math.cos(radians));
      const newWidth = Math.floor(img.width * cos + img.height * sin);
      const newHeight = Math.floor(img.height * cos + img.width * sin);
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Reset transformations
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Move to center
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // Apply rotation
      ctx.rotate(radians);
      
      // Apply flips
      if (flipH) ctx.scale(-1, 1);
      if (flipV) ctx.scale(1, -1);
      
      // Build filter string
      let filter = '';
      if (brightness !== 100) filter += `brightness(${brightness}%) `;
      if (contrast !== 100) filter += `contrast(${contrast}%) `;
      if (saturation !== 100) filter += `saturate(${saturation}%) `;
      if (blur > 0) filter += `blur(${blur}px) `;
      if (hue !== 0) filter += `hue-rotate(${hue}deg) `;
      if (grayscale) filter += 'grayscale(100%) ';
      if (sepia) filter += 'sepia(100%) ';
      if (invert) filter += 'invert(100%) ';
      
      ctx.filter = filter.trim();
      
      // Draw image centered
      ctx.drawImage(img, -img.width/2, -img.height/2);
      
      // Update preview image
      setPreviewImage(canvas.toDataURL('image/jpeg'));
    };
  };

  // Apply current settings as a new augmented image
  const applyAugmentation = () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = originalImage;
      
      img.onload = () => {
        const radians = rotation * Math.PI / 180;
        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));
        const newWidth = Math.floor(img.width * cos + img.height * sin);
        const newHeight = Math.floor(img.height * cos + img.width * sin);
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(radians);
        
        if (flipH) ctx.scale(-1, 1);
        if (flipV) ctx.scale(1, -1);
        
        // Build filter string
        let filter = '';
        if (brightness !== 100) filter += `brightness(${brightness}%) `;
        if (contrast !== 100) filter += `contrast(${contrast}%) `;
        if (saturation !== 100) filter += `saturate(${saturation}%) `;
        if (blur > 0) filter += `blur(${blur}px) `;
        if (hue !== 0) filter += `hue-rotate(${hue}deg) `;
        if (grayscale) filter += 'grayscale(100%) ';
        if (sepia) filter += 'sepia(100%) ';
        if (invert) filter += 'invert(100%) ';
        
        ctx.filter = filter.trim();
        
        ctx.drawImage(img, -img.width/2, -img.height/2);
        
        // Create augmented image object
        const augmentedImage = {
          id: Date.now(),
          url: canvas.toDataURL('image/jpeg'),
          width: canvas.width,
          height: canvas.height,
          settings: {
            rotation,
            brightness,
            contrast,
            saturation,
            blur,
            hue,
            flipH,
            flipV,
            grayscale,
            sepia,
            invert
          }
        };
        
        setAugmentedImages(prev => [...prev, augmentedImage]);
        setIsProcessing(false);
        
        // Reset settings after applying
        resetSettings();
      };
    }, 300);
  };

  const deleteAugmentedImage = (id) => {
    setAugmentedImages(prev => prev.filter(img => img.id !== id));
  };

  const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'augmented-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setOriginalImage(null);
    setAugmentedImages([]);
    resetSettings();
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const augmentationTypes = [
    { id: "adjust", name: "Adjustments", icon: "⚙️" },
    { id: "flip", name: "Flip", icon: "🔄" },
    { id: "filters", name: "Filters", icon: "🎨" },
  ];

  return (
    <div className="w-full h-full border-l border-slate-200">
      <div className="">
        <h1 className="px-4 py-2 text-2xl font-bold text-gray-800 border-b border-slate-200">Advanced Image Augmentor</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Left Panel - Controls */}
        <div className="relative lg:col-span-1 space-y-6 h-[86vh] overflow-auto">
      	  <h2 className="sticky top-0 px-4 bg-white text-xl font-semibold text-gray-800 p-2 border-b border-slate-200">Upload Image</h2>
          {/* Upload Section */}
          <div className="bg-white p-2">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {originalImage && (
                  <button
                    onClick={resetAll}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors whitespace-nowrap"
                  >
                    Reset All
                  </button>
                )}
              </div>
              
              {originalImage && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Original Image</h3>
                  <div className="w-full h-40 overflow-hidden rounded-md border border-gray-300 flex items-center justify-center">
                    <img 
                      src={originalImage} 
                      alt="Original" 
                      className="max-w-full max-h-full object-contain"
                      ref={originalImageRef}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Augmentation Controls */}
          {originalImage && (
            <div className="bg-white p-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Transformations</h2>
              
              <div className="flex mb-4 border-b border-gray-200">
                {augmentationTypes.map((aug) => (
                  <button
                    key={aug.id}
                    onClick={() => setSelectedAugmentation(aug.id)}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors
                      ${selectedAugmentation === aug.id 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-lg mb-1">{aug.icon}</span>
                      <span>{aug.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Adjustment Controls */}
              <div className="space-y-5">
                {selectedAugmentation === "adjust" && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Rotation: {rotation}°</label>
                        <button 
                          onClick={() => setRotation(0)}
                          className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Reset
                        </button>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between">
                        <button 
                          onClick={() => setRotation(prev => Math.max(0, prev - 15))}
                          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                        >
                          -15°
                        </button>
                        <button 
                          onClick={() => setRotation(prev => Math.min(360, prev + 15))}
                          className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                        >
                          +15°
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Brightness: {brightness}%</label>
                        <button 
                          onClick={() => setBrightness(100)}
                          className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Reset
                        </button>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Contrast: {contrast}%</label>
                        <button 
                          onClick={() => setContrast(100)}
                          className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Reset
                        </button>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={contrast}
                        onChange={(e) => setContrast(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Saturation: {saturation}%</label>
                        <button 
                          onClick={() => setSaturation(100)}
                          className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Reset
                        </button>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={saturation}
                        onChange={(e) => setSaturation(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Blur: {blur}px</label>
                        <button 
                          onClick={() => setBlur(0)}
                          className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Reset
                        </button>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={blur}
                        onChange={(e) => setBlur(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Hue: {hue}°</label>
                        <button 
                          onClick={() => setHue(0)}
                          className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                        >
                          Reset
                        </button>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={hue}
                        onChange={(e) => setHue(parseInt(e.target.value))}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </>
                )}
                
                {selectedAugmentation === "flip" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setFlipH(!flipH)}
                        className={`py-4 rounded-lg border flex flex-col items-center justify-center transition-all
                          ${flipH ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                      >
                        <span className="text-3xl mb-2">↔️</span>
                        <span className="text-sm font-medium">Flip Horizontal</span>
                        <span className="text-xs text-gray-500 mt-1">
                          {flipH ? "Applied" : "Click to apply"}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setFlipV(!flipV)}
                        className={`py-4 rounded-lg border flex flex-col items-center justify-center transition-all
                          ${flipV ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                      >
                        <span className="text-3xl mb-2">↕️</span>
                        <span className="text-sm font-medium">Flip Vertical</span>
                        <span className="text-xs text-gray-500 mt-1">
                          {flipV ? "Applied" : "Click to apply"}
                        </span>
                      </button>
                    </div>
                    
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => {
                          setFlipH(false);
                          setFlipV(false);
                        }}
                        className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Reset Flip Settings
                      </button>
                    </div>
                  </div>
                )}
                
                {selectedAugmentation === "filters" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setGrayscale(!grayscale)}
                        className={`py-4 rounded-lg border flex flex-col items-center justify-center transition-all
                          ${grayscale ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                      >
                        <span className="text-3xl mb-2">⚫️⚪️</span>
                        <span className="text-sm font-medium">Grayscale</span>
                        <span className="text-xs text-gray-500 mt-1">
                          {grayscale ? "Applied" : "Click to apply"}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setSepia(!sepia)}
                        className={`py-4 rounded-lg border flex flex-col items-center justify-center transition-all
                          ${sepia ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                      >
                        <span className="text-3xl mb-2">🟤</span>
                        <span className="text-sm font-medium">Sepia</span>
                        <span className="text-xs text-gray-500 mt-1">
                          {sepia ? "Applied" : "Click to apply"}
                        </span>
                      </button>
                      
                      <button
                        onClick={() => setInvert(!invert)}
                        className={`py-4 rounded-lg border flex flex-col items-center justify-center transition-all
                          ${invert ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                      >
                        <span className="text-3xl mb-2">🔄</span>
                        <span className="text-sm font-medium">Invert Colors</span>
                        <span className="text-xs text-gray-500 mt-1">
                          {invert ? "Applied" : "Click to apply"}
                        </span>
                      </button>
                    </div>
                    
                    <div className="flex justify-center pt-2">
                      <button
                        onClick={() => {
                          setGrayscale(false);
                          setSepia(false);
                          setInvert(false);
                        }}
                        className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={applyAugmentation}
                  disabled={isProcessing || previewLoading}
                  className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Applying...
                    </>
                  ) : (
                    "Apply to Create New Augmented Image"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Preview and Results */}
        <div className="lg:col-span-2 h-[86vh] sm:border-t md:border-t-0 md:border-l border-slate-200 overflow-auto">
          {originalImage ? (
            <div className="bg-white h-full">
				{/* Preview Section */}
			  <div className="sticky top-0 z-50 flex border-b border-slate-200 bg-white justify-between items-center p-2 mb-2">
				<h2 className="text-xl font-semibold text-gray-800">Live Preview</h2>
				<span className="text-sm text-gray-500">
				{previewLoading ? "Generating preview..." : "Changes update in real-time"}
				</span>
			  </div>
              <div className="p-2 relative mb-8">
                
                <div className="bg-gray-100 rounded-lg flex flex-col items-center">
                  {previewImage ? (
                    <div className="relative">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="max-w-full max-h-96 object-contain rounded-md border border-gray-300"
                      />
                      {previewLoading && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md">
                          <div className="text-white flex items-center">
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating preview...
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-96 flex items-center justify-center text-gray-500">
                      {previewLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin h-5 w-5 mr-2 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating preview...
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto flex items-center justify-center text-gray-400 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18m0 0l-4-4m4 4l4-4" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Adjust Parameters to See Preview</h3>
                          <p className="text-gray-500">
                            Use the controls on the left to start editing your image
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => previewImage && downloadImage(previewImage, 'preview-image.jpg')}
                      disabled={!previewImage || previewLoading}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download Preview
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Augmented Images Grid */}
              <div className="">
                <div className="border-t border-b p-2 border-slate-200 flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Augmented Results</h2>
                  <span className="text-sm text-gray-500">
                    {augmentedImages.length} saved augmentation{augmentedImages.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {augmentedImages.length > 0 ? (
                  <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                    {augmentedImages.map((img) => (
                      <div key={img.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-50">
                        <div className="bg-gray-100 p-4 flex items-center justify-center" style={{ height: '150px' }}>
                          <img 
                            src={img.url} 
                            alt={`Augmented: ${img.id}`} 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="p-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {img.width} × {img.height}px
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => downloadImage(img.url)}
                                className="text-gray-600 hover:text-blue-600 transition-colors p-1"
                                title="Download"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteAugmentedImage(img.id)}
                                className="text-gray-600 hover:text-red-600 transition-colors p-1"
                                title="Delete"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center text-gray-400 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18m0 0l-4-4m4 4l4-4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Augmented Images Yet</h3>
                    <p className="text-gray-500 max-w-md">
                      Apply your adjustments to create new augmented images that will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center h-full flex items-center justify-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto flex items-center justify-center text-gray-400 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Upload an Image to Begin</h3>
                <p className="text-gray-500 mb-4">
                  Start by uploading an image using the panel on the left
                </p>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Upload Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden canvas for preview generation */}
      <canvas ref={previewCanvasRef} className="hidden" />
      
    </div>
  );
}

export default ImageAugmentor;