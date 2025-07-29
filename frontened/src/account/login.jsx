import React, { useState } from 'react';
import { FaFile } from 'react-icons/fa';
import LandingPage from './landingPage';
const apiUrl = import.meta.env.VITE_API_URL;

const CreateAccount = ({ setUserExists }) => {
  const [mode, setMode] = useState('signup'); // 'signup' or 'signin'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [signin, setSignin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email) {
      alert('Please enter both username and email');
      return;
    }

    const endpoint = mode === 'signup' ? '/api/users' : '/api/users/signin';

    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        alert(`${mode === 'signup' ? 'Account created' : 'Signed in'} successfully!`);
        setUserExists(true);
      } else {
        console.error(data);
        alert(data.message || 'Error occurred');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  if(!signin) return <LandingPage setSignin={setSignin}/>

  return (
    <div className='w-full h-screen bg-slate-100 flex justify-center items-center'>
      <div className="bg-white w-[80%] sm:w-100 shadow-sm mt-5 md:mt-0">
        <div className='w-full flex flex-row items-center gap-2 p-2 text-lg font-bold bg-slate-800 text-white '>
          <p className="h-full capitalize items-center flex px-2 font-bold text-lg">
					<div className="relative mr-3">
						<FaFile className="text-green-300 border-3 border-dashed border-green-300 rounded-full"/>
					</div>
					ImageMark Studi<span className="p-[5px] mt-[2px] border-dashed border-3 border-white rounded-full ml-[1px] animate-spin"></span>
				</p>
        </div>
        <div className='p-4'>
          <h2>{mode === 'signup' ? 'Create Account' : 'Sign In'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            {loading ? 
            <div
              className='flex items-center justify-center'
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
              >
               <div className='p-2 border-4 border-dashed border-white w-fit rounded-full animate-spin'>
                </div> 
            </div>
            :
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
            }
          </form>
          <p style={{ marginTop: '10px' }}>
            {mode === 'signup' ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
            <span
              onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
              style={{ color: 'blue', cursor: 'pointer' }}
            >
              {mode === 'signup' ? 'Sign In' : 'Create one'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
