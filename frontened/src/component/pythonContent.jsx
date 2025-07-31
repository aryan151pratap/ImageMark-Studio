import React, { useState } from 'react';
import { FaCopy, FaCheck, FaChevronDown, FaChevronUp, FaTerminal, FaFileCode, FaRobot, FaLaptopCode } from 'react-icons/fa';

const steps = [
  {
    title: 'Install Ultralytics',
    icon: <FaTerminal className="text-blue-500" />,
    code: `!pip install ultralytics`,
    description: 'Install the Ultralytics YOLO library (required for YOLOv8/YOLOv11 training)'
  },
  {
    title: 'Import YOLO Class',
    icon: <FaFileCode className="text-purple-500" />,
    code: `from ultralytics import YOLO`,
    description: 'Import the YOLO class to access training, validation, and prediction methods'
  },
  {
    title: 'Load Pre-trained Model',
    icon: <FaRobot className="text-orange-500" />,
    code: `model = YOLO("yolo11s.pt")`,
    description: 'Load a YOLOv11 Small model (transfer learning for better accuracy)'
  },
  {
    title: 'Train the Model',
    icon: <FaLaptopCode className="text-green-500" />,
    code: `model.train(
    data="data.yaml",
    epochs=60,
    imgsz=640,
    batch=16,
    lr0=0.001,
    optimizer="AdamW",
    patience=20,
    augment=True,
    cache=True
)`,
    description: 'Train YOLO with custom dataset and hyperparameters'
  },
  {
    title: 'Validate the Model',
    icon: <FaTerminal className="text-blue-500" />,
    code: `metrics = model.val()`,
    description: 'Check model performance (precision, recall, mAP, etc.)'
  },
  {
    title: 'Run Inference on New Image',
    icon: <FaRobot className="text-orange-500" />,
    code: `results = model("test.jpg")\nresults.show()`,
    description: 'Test your trained YOLO model on a new image'
  },
  {
    title: 'Export Trained Model',
    icon: <FaFileCode className="text-purple-500" />,
    code: `model.export(format="onnx")`,
    description: 'Export model to ONNX format for deployment in other languages/environments'
  },
];

const PythonYoloTrainingGuide = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState(Array(steps.length).fill(true));

  const toggleStep = (index) => {
    const newExpandedSteps = [...expandedSteps];
    newExpandedSteps[index] = !newExpandedSteps[index];
    setExpandedSteps(newExpandedSteps);
  };

  const copyToClipboard = async (text, index) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      alert("❌ Failed to copy code: " + err.message);
    }
  };

  return (
    <div className="w-full overflow-auto border-slate-200">
      <div className="p-2 sm:p-4 md:p-6">
        <header className="bg-white rounded-xl shadow-md p-6 mb-8 text-center border border-indigo-100">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLaptopCode className="text-green-600 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">YOLO Python API Training Guide</h1>
          <p className="text-gray-600 mb-4">Step-by-step guide for training YOLOv11 using Python API</p>
          <div className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            <FaTerminal className="mr-2" />
            Python API Optimized
          </div>
        </header>

        <div className="mb-8 bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Guide Overview</h2>
          <div className="flex flex-wrap gap-3">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex items-center bg-green-50 rounded-lg px-3 py-2 text-sm font-medium border border-green-200"
              >
                <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  {index+1}
                </div>
                <div className="text-gray-700">{step.title.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow overflow-hidden border border-gray-200"
            >
              <div 
                className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 transition-all"
                onClick={() => toggleStep(index)}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-green-500 text-white font-bold">
                    {index+1}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{step.title}</h2>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">
                    {step.icon}
                  </span>
                  {expandedSteps[index] ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                </div>
              </div>
              
              {expandedSteps[index] && (
                <div className="p-4 pt-2">
                  <div className="relative">
                    <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono text-gray-800 border border-gray-200">
                      <code>{step.code}</code>
                    </pre>
                    <button
                      onClick={() => copyToClipboard(step.code, index)}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 hover:text-green-600 transition-all"
                      title="Copy to Clipboard"
                    >
                      {copiedIndex === index ? <FaCheck className="text-green-500" /> : <FaCopy />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
          <p className="mb-2">© 2025 YOLO Python API Training Guide • Created with React</p>
          <p>Tip: Run these steps in Jupyter or Colab for the best results</p>
        </footer>
      </div>
    </div>
  );
};

export default PythonYoloTrainingGuide;
