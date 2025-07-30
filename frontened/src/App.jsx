import { useEffect, useState } from 'react';
import './App.css';
import Studio from './component/studio';
import Top_bar from './top/top_bar';
import Left_bar from './left_bar/left_bar';
import CreateAccount from './account/login'; // Import your form component
import File from './component/file';
import YoloTrainingGuide from './component/content';
import Download from './component/download';
import ImageAugmentor from './augmentation/augmen';


const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [userExists, setUserExists] = useState(false);
  const [user, setUser] = useState(null);
  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [openContent, setOpenContent] = useState('studio');
  const [file, setFile] = useState([]);


  useEffect(() => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (username && email) {
      setUserExists(true);
      setUser(email);

      const fetchFolders = async () => {
        try {
          const res = await fetch(`${apiUrl}/api/get_folder/${email}`, {
            method: 'GET'
          });

          const data = await res.json();
          if (res.ok) {
            setFolder(data.folder);
          }
        } catch (err) {
          console.error("Error fetching folders:", err);
        }
      };

      fetchFolders();
    } else {
      setUserExists(false);
    }
  }, [userExists]);


  return (
    <div className='md:max-h-screen w-full'>
      {!userExists ?
        <div className='w-full h-full'>
          <CreateAccount setUserExists={setUserExists}/>
        </div>
        :
        <div className='h-full w-full'>
          <div className='w-full border-b border-slate-200'>
            <Top_bar setOpenContent={setOpenContent} setFiles={setFiles} setCurrentFile={setCurrentFile}/>
          </div>

          <div className='h-full w-full flex flex-row'>
            <div className='w-fit sticky top-0 sm:max-h-[93vh] md:h-full bg-white'>
              <Left_bar user={user} folders={folder} setFolders={setFolder} setFiles={setFiles} currentFile={currentFile} setCurrentFile={setCurrentFile} setOpenContent={setOpenContent}
                setFile={setFile} file={file}
              />
            </div>
               
            {files.length > 0 ?
              <div className='h-full w-full'>
                <File files={files} user={user} currentFile={currentFile} setCurrentFile={setCurrentFile} setFiles={setFiles} setFile={setFile} file={file}/>
              </div>
              :
              openContent === 'document' ? 
              <YoloTrainingGuide/>
              :
              openContent === 'studio'  ? 
              <div className='h-full w-full'>
                <Studio user={user} folder={folder}/>
              </div>
              :
              openContent === 'augmentation'  ? 
              <ImageAugmentor/>
              :
              <Download download={openContent} user={user} setFiles={setFiles}/>
                      
            }
            
          </div>
        </div>
      }
    </div>
  )
}

export default App;
