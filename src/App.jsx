import { useState } from 'react';
import { bitable } from '@lark-base-open/js-sdk';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Data save ho raha hai... ⏳');

    try {
      const table = await bitable.base.getTableById("tblkXSPDlbXi19T0");

      const nameField = await table.getFieldByName("User Name");
      const emailField = await table.getFieldByName("Email");
      const roleField = await table.getFieldByName("Role");

      // 1. Sheet se Role column ke saare options (Admin, Super User) mangwa lo
      const allOptions = await roleField.getOptions();

      // 2. Jo role user ne form me select kiya hai, uski ID dhoondho
      const selectedOption = allOptions.find(opt => opt.name === role);

      // Agar by-chance option sheet me nahi hai, toh form ruk jayega aur bata dega
      if (!selectedOption) {
        setStatus(`Error: "${role}" option sheet me nahi mila. Check spelling!`);
        return;
      }

      // 3. Un IDs ka use karke Lark me data bhejna
      await table.addRecord({
        fields: {
          [nameField.id]: name,
          [emailField.id]: email,

          // Ab hum text nahi, direct Option ID bhej rahe hain
          [roleField.id]: { id: selectedOption.id }
        }
      });

      setStatus('Success! Data Lark sheet me chala gaya 🎉');
      setName('');
      setEmail('');

      setTimeout(() => setStatus(''), 3000);

    } catch (error) {
      console.error(error);
      setStatus('Error: ' + error.message);
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