import './ClubCard.css';

function ClubCard({ club, isSelected, isTaken, onSelect, selectedBy }) {
  const handleClick = () => {
    if (!isTaken && !isSelected) {
      onSelect(club.id);
    }
  };

  return (
    <div
      className={`club-card ${isSelected ? 'selected' : ''} ${isTaken ? 'taken' : ''}`}
      onClick={handleClick}
    >
      <div className="club-image">
        <img src={club.logo_url} alt={club.name} />
      </div>
      <div className="club-info">
        <h3>{club.name}</h3>
        <p className="league">{club.league}</p>
        {isTaken && <p className="taken-badge">Taken by {selectedBy}</p>}
        {isSelected && <p className="selected-badge">Your Club</p>}
      </div>
    </div>
  );
}

export default ClubCard;
