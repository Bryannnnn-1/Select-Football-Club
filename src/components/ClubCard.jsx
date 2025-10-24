import alNassr from '../assets/al-nassr.svg';
import alHilal from '../assets/al-hilal.svg';
import acMilan from '../assets/ac-Milan.svg';
import arsenal from '../assets/arsenal-fc.svg';
import athleticBilbao from '../assets/athletic-bilbao.svg';
import barcelona from '../assets/FC_Barcelona.svg';
import benfica from '../assets/benfica.svg';
import bayernMunich from '../assets/fc-bayern-munich.svg';
import fcPorto from '../assets/fc-porto-logo.svg';
import borussiaDortmund from '../assets/borussia-dortmund.svg';
import chelsea from '../assets/chelsea-fc.svg';
import interMiami from '../assets/inter-miami.svg';
import interMilan from '../assets/inter-milan.svg';
import juventus from '../assets/Juventus.svg';
import liverpool from '../assets/liverpool.svg';
import manCity from '../assets/manchester-city.svg';
import manUnited from '../assets/manchester-united.svg';
import newcastle from '../assets/newcastle-united.svg';
import psg from '../assets/PSG.svg';
import realMadrid from '../assets/real_madrid.svg';
import './ClubCard.css';

function ClubCard({ club, isSelected, isTaken, onSelect, selectedBy }) {
  const logoMap = {
    'al-nassr': alNassr,
    "ac-milan": acMilan,
    'al-hilal': alHilal,
    'al-nassr': alNassr,
    'arsenal-fc': arsenal,
    'athletic-bilbao': athleticBilbao,
    'benfica': benfica,
    'FC_Barcelona': barcelona,
    'fc-bayern-munich': bayernMunich,
    'fc-porto-logo': fcPorto,
    'borussia-dortmund': borussiaDortmund,
    'chelsea-fc': chelsea,
    'inter-miami': interMiami,
    'inter-milan': interMilan,
    'Juventus': juventus,
    'liverpool': liverpool,
    'manchester-city': manCity,
    'manchester-united': manUnited,
    'newcastle-united': newcastle,
    'PSG': psg,
    'real_madrid': realMadrid,
  };
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
        <img src={logoMap[club.logo_url]} alt={club.name} />
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
