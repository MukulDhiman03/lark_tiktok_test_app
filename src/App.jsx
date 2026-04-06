import { useState } from 'react';
import { bitable } from '@lark-base-open/js-sdk';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Backend ko data bhej raha hoon... 🚀');

    try {
      // --- YE RAHI AAPKI ASLI API CALL (FETCH) ---
      const response = await fetch("http://localhost:5000/add-user", {
        method: "POST", // Data bhej rahe hain
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          role: role
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('Success! Backend ne Lark me save kar diya 🎉');
        setName('');
        setEmail('');
      } else {
        setStatus('Error: ' + JSON.stringify(result.error));
      }
      // ------------------------------------------

    } catch (error) {
      console.error(error);
      setStatus('Error: Backend server band hai ya connect nahi ho raha!');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px' }}>
      <h2 style={{ color: '#3370ff' }}>Naya User Add Karein 👨‍💻</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        <div>
          <label><strong>Name:</strong></label><br />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div>
          <label><strong>Email:</strong></label><br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>

        <div>
          <label><strong>Role:</strong></label><br />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            {/* Dhyan rahe: Ye options aapki sheet ke dropdown options se match hone chahiye */}
            <option value="Admin">Admin</option>
            <option value="Super User">Super User</option>
            <option value="Standard">Standard</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#3370ff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Save to Lark Sheet
        </button>

      </form>

      {status && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', color: status.includes('Error') ? 'red' : 'green' }}>
          {status}
        </div>
      )}
    </div>
  );
}

export default App;