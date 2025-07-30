import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_API_URL;

function Download({ download ,user}){
	const [labels, setLabels] = useState([]);
	const [loading, setLoading] = useState(false);

	const downloadAnnotations = async (folder) => {
		const response = await fetch(`${apiUrl}/api/download/${download}/${user}`);
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${folder}_annotations.zip`;
		document.body.appendChild(a);
		a.click();
		a.remove();
	};

	const downloadLabels = () => {
		const content = labels.join("\n");
		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "labels.txt";
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	};


	useEffect(() => {
		const get_labels = async function(){
			try{
				setLoading(true);
				const res = await fetch(`${apiUrl}/api/labels/${download}/${user}`, {
					method: 'GET'
				});

				const data = await res.json();
				if(res.ok){
					console.log(data);
					if (res.ok && data.labels) {
					setLabels((prev) => [
						...new Set([...prev, ...data.labels]),
					]);
}				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		get_labels();

	}, [])


	return (
		<div className="w-full h-full border-l border-slate-200 bg-white">
			<div className="w-full flex flex-row border-b border-slate-200 text-white">
				<h2 className="w-fit font-semibold bg-slate-700 px-2 py-1">{download}</h2>
				<div className="ml-auto flex flex-row items-center">
					<button className="border-r border-slate-200 bg-green-800 text-white px-4 py-1 flex flex-row items-center gap-1 text-green-600 hover:text-green-700 cursor-pointer"
						onClick={downloadLabels}
					>
						<FaDownload/> Download Labels
					</button>
					<button
						className="bg-red-800 text-white flex flex-row items-center gap-1 px-4 py-1 text-red-500 hover:text-red-600 font-medium transition cursor-pointer"
						onClick={() => downloadAnnotations(download)}
					>
						<FaDownload/> Download Annotations
					</button>
				</div>
			</div>

			<div className="w-full h-full mb-5">
				<div className="w-full h-full overflow-auto">
					<div className="flex flex-row p-2">
						<h3 className="h-full flex items-center font-bold text-slate-800 mb-3">Labels</h3>
					</div>
					{loading ? 
					<div className="flex flex-col gap-4 justify-center items-center h-50 md:h-full">
						<div className="w-12 h-12 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
						<span>Loading....</span>
					</div>
					:	
					<div className="px-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 flex flex-wrap gap-2">
						{labels?.map((label, index) => (
							<span
							key={index}
							className="text-sm px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 hover:bg-slate-200 transition"
							>
							{index + 1}. {label}
						</span>
						))}
					</div>
					}
				</div>

			</div>
		</div>
	);
}

export default Download;