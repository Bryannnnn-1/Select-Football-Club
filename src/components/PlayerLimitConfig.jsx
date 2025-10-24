import { useState } from 'react';
import './PlayerLimitConfig.css';

function PlayerLimitConfig({ currentLimit, onUpdate, currentPlayerCount }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newLimit, setNewLimit] = useState(currentLimit);

  const handleSave = () => {
    if (newLimit > 0 && newLimit !== currentLimit) {
      onUpdate(newLimit);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewLimit(currentLimit);
    setIsEditing(false);
  };

  return (
    <div className="player-limit-config">
      <div className="config-header">
        <div className="limit-info">
          <h3>Player Limit</h3>
          {!isEditing && (
            <div className="limit-display">
              <span className="current-count">{currentPlayerCount}</span>
              <span className="separator">/</span>
              <span className="max-limit">{currentLimit}</span>
              <span className="label">players</span>
            </div>
          )}
        </div>
        {!isEditing && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Change Limit
          </button>
        )}
      </div>

      {isEditing && (
        <div className="edit-section">
          <div className="input-group">
            <label htmlFor="player-limit">Set Maximum Players:</label>
            <input
              type="number"
              id="player-limit"
              min="1"
              max="100"
              value={newLimit}
              onChange={(e) => setNewLimit(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="button-group">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {currentPlayerCount >= currentLimit && (
        <div className="limit-warning">
          Player limit reached! No more selections allowed.
        </div>
      )}
    </div>
  );
}

export default PlayerLimitConfig;
