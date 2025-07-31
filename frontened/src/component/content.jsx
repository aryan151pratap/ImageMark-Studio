import React, { useState } from 'react';
import { FaCopy, FaCheck, FaChevronDown, FaChevronUp, FaTerminal, FaFileCode, FaRobot, FaLaptopCode } from 'react-icons/fa';
import Model from './model';
import PythonYoloTrainingGuide from './pythonContent';

const steps = [
  {
    title: 'Load NVIDIA GPU & Unzip Dataset',
    icon: <FaTerminal className="text-blue-500" />,
    code: `!nvidia-smi\n!unzip -q /content/data.zip -d /content/custom_data`,
    description: 'Initialize the GPU and extract your dataset'
  },
  {
    title: 'Download and Run train_val_split.py',
    icon: <FaFileCode className="text-purple-500" />,
    code: `!wget -O /content/train_val_split.py https://raw.githubusercontent.com/EdjeElectronics/Train-and-Deploy-YOLO-Models/refs/heads/main/utils/train_val_split.py\n!python train_val_split.py --datapath="/content/custom_data" --train_pct=0.9`,
    description: 'Prepare your dataset for training and validation'
  },
  {
    title: 'Install YOLOv8',
    icon: <FaLaptopCode className="text-green-500" />,
    code: `!pip install ultralytics`,
    description: 'Install the required YOLOv8 library'
  },
  {
    title: 'Auto-create data.yaml using Python',
    icon: <FaFileCode className="text-purple-500" />,
    code: `import yaml\nimport os\n\ndef create_data_yaml(path_to_classes_txt, path_to_data_yaml):\n    if not os.path.exists(path_to_classes_txt):\n        print(f'classes.txt not found at {path_to_classes_txt}')\n        return\n    with open(path_to_classes_txt, 'r') as f:\n        classes = [line.strip() for line in f if line.strip()]\n    data = {\n        'path': '/content/data',\n        'train': 'train/images',\n        'val': 'validation/images',\n        'nc': len(classes),\n        'names': classes\n    }\n    with open(path_to_data_yaml, 'w') as f:\n        yaml.dump(data, f, sort_keys=False)\n    print(f'Created config at {path_to_data_yaml}')\n\ncreate_data_yaml('/content/custom_data/classes.txt', '/content/data.yaml')`,
    description: 'Generate the configuration file for your model'
  },
  {
    title: 'Check YAML Output',
    icon: <FaTerminal className="text-blue-500" />,
    code: `!cat /content/data.yaml`,
    description: 'Verify the configuration file was created correctly'
  },
  {
    title: 'Train YOLOv8s Model',
    icon: <FaRobot className="text-orange-500" />,
    code: `!yolo detect train data=/content/data.yaml model=yolo11s.pt epochs=60 imgsz=640`,
    description: 'Start the training process for your model'
  },
  {
    title: 'Run Prediction',
    icon: <FaRobot className="text-orange-500" />,
    code: `!yolo detect predict model=runs/detect/train/weights/best.pt source=data/validation/images save=True`,
    description: 'Test your trained model with validation images'
  },
  {
    title: 'View Prediction Outputs',
    icon: <FaTerminal className="text-blue-500" />,
    code: `import glob\nfrom IPython.display import Image, display\nfor image_path in glob.glob(f'/content/runs/detect/predict/*.jpg')[:10]:\n    display(Image(filename=image_path, height=400))\n    print('\\n')`,
    description: 'Inspect the prediction results'
  },
  {
    title: 'Save Model + Train Output as ZIP',
    icon: <FaTerminal className="text-blue-500" />,
    code: `!mkdir /content/my_model\n!cp /content/runs/detect/train/weights/best.pt /content/my_model/my_model.pt\n!cp -r /content/runs/detect/train /content/my_model\n%cd my_model\n!zip /content/my_model.zip my_model.pt\n!zip -r /content/my_model.zip train\n%cd /content`,
    description: 'Export your trained model and training artifacts'
  },
  {
    title: '(Optional) Install torch with CUDA',
    icon: <FaTerminal className="text-blue-500" />,
    code: `pip install --upgrade torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124`,
    description: 'Install GPU-accelerated libraries for better performance'
  },
  {
    title: 'Run Trained YOLO with USB Camera',
    icon: <FaRobot className="text-orange-500" />,
    code: `curl -o yolo_detect.py https://raw.githubusercontent.com/EdjeElectronics/Train-and-Deploy-YOLO-Models/refs/heads/main/yolo_detect.py\npython yolo_detect.py --model my_model.pt --source usb0 --resolution 1280x720`,
    description: 'Deploy your model to real-time USB camera input'
  },
];

const YoloTrainingGuide = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState(Array(steps.length).fill(true));
  const [pages, setPages] = useState(1);
  const all_pages = [1, 2, 3];

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
    <div className="w-full border-l border-slate-200 overflow-auto border-t border-slate-200">
		<div className="flex flex-wrap gap-2 mt-3 justify-center">
			{all_pages.map((i, index) => (
				<button
				key={index}
				className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
					pages === i
					? 'bg-green-500 text-white border-green-600'
					: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
				}`}
				onClick={() => setPages(i)}
				>
				Page {i}
				</button>
			))}
		</div>

	{pages === 1 ?

      <div className="p-2 sm:p-4 md:p-6">
        <header className="bg-white rounded-xl shadow-md p-6 mb-8 text-center border border-indigo-100">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaRobot className="text-blue-600 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">YOLO Models Training Guide</h1>
          <p className="text-gray-600 mb-4">Step-by-step instructions for training computer vision models in Google Colab</p>
          <div className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            <FaTerminal className="mr-2" />
            Google Colab Optimized
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl shadow border border-blue-100">
            <h3 className="font-bold text-lg mb-3 flex items-center text-blue-600">
              <FaTerminal className="mr-2" />
              Prerequisites
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Google Colab account</li>
              <li>Dataset in YOLO format</li>
              <li>Basic Python knowledge</li>
            </ul>
          </div>
          <div className="bg-white p-5 rounded-xl shadow border border-purple-100">
            <h3 className="font-bold text-lg mb-3 flex items-center text-purple-600">
              <FaFileCode className="mr-2" />
              Estimated Time
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Setup: 10-15 minutes</li>
              <li>Training: 30min - 4hrs</li>
              <li>Export: 5-10 minutes</li>
            </ul>
          </div>
          <div className="bg-white p-5 rounded-xl shadow border border-green-100">
            <h3 className="font-bold text-lg mb-3 flex items-center text-green-600">
              <FaLaptopCode className="mr-2" />
              Tips
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Use GPU runtime</li>
              <li>Start with small models</li>
              <li>Monitor training metrics</li>
            </ul>
          </div>
        </div>

        <div className="mb-8 bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Guide Overview</h2>
          <div className="flex flex-wrap gap-3">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex items-center bg-blue-50 rounded-lg px-3 py-2 text-sm font-medium border border-blue-200"
              >
                <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center mr-2">
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
                className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 transition-all"
                onClick={() => toggleStep(index)}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-blue-500 text-white font-bold">
                    {index+1}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{step.title}</h2>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-blue-500 mr-3">
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
                      className="absolute top-3 right-3 p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-all"
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
          <p className="mb-2">© 2023 YOLOv8 Training Guide • Created with React</p>
          <p>Tip: Run these steps sequentially in Google Colab for best results</p>
        </footer>
      </div>
	  :
    pages === 2 ?
    <PythonYoloTrainingGuide/>
    :
		<div>
			<Model/>
		</div>
	}
    </div>
  );
};

export default YoloTrainingGuide;