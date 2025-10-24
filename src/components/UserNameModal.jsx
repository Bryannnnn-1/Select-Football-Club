import { useState } from 'react';
import './UserNameModal.css';

function UserNameModal({ onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Your Club</h2>
        <p>Enter your name to get started</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          <button type="submit">Continue</button>
        </form>
      </div>
    </div>
  );
}

export default UserNameModal;
