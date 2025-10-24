import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ClubCard from './components/ClubCard';
import PlayerLimitConfig from './components/PlayerLimitConfig';
import UserNameModal from './components/UserNameModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import './App.css';

function App() {
  const [clubs, setClubs] = useState([]);
  const [selections, setSelections] = useState([]);
  const [playerLimit, setPlayerLimit] = useState(11);
  const [configId, setConfigId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userSelection, setUserSelection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Load saved admin session
  useEffect(() => {
    const savedAdmin = localStorage.getItem('isAdmin');
    if (savedAdmin === 'true') setIsAdmin(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('isAdmin', isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    loadInitialData();
    subscribeToChanges();
  }, []);

  const loadInitialData = async () => {
    try {
      const [clubsData, selectionsData, configData] = await Promise.all([
        supabase.from('clubs').select('*').order('name'),
        supabase.from('user_selections').select('*'),
        supabase.from('game_config').select('*').maybeSingle(),
      ]);

      if (clubsData.data) setClubs(clubsData.data);
      if (selectionsData.data) setSelections(selectionsData.data);

      if (configData.data) {
        setPlayerLimit(configData.data.player_limit);
        setConfigId(configData.data.id);
      } else {
        const { data: newConfig } = await supabase
          .from('game_config')
          .insert({ player_limit: 11 })
          .select()
          .single();
        if (newConfig) {
          setPlayerLimit(newConfig.player_limit);
          setConfigId(newConfig.id);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    const selectionsChannel = supabase
      .channel('selections_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_selections' },
        () => {
          loadSelections();
        }
      )
      .subscribe();

    const configChannel = supabase
      .channel('config_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'game_config' },
        () => {
          loadConfig();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(selectionsChannel);
      supabase.removeChannel(configChannel);
    };
  };

  const loadSelections = async () => {
    const { data } = await supabase.from('user_selections').select('*');
    if (data) setSelections(data);
  };

  const loadConfig = async () => {
    const { data } = await supabase.from('game_config').select('*').maybeSingle();
    if (data) setPlayerLimit(data.player_limit);
  };

  const handleUserNameSubmit = (name) => {
    setUserName(name);
    const existingSelection = selections.find((s) => s.user_name === name);
    if (existingSelection) {
      setUserSelection(existingSelection);
    }
  };

  const handleClubSelect = async (clubId) => {
    if (selections.length >= playerLimit) {
      alert('Player limit reached! Cannot select more clubs.');
      return;
    }

    if (!userName) return;

    try {
      if (userSelection) {
        await supabase.from('user_selections').delete().eq('id', userSelection.id);
      }

      const { data, error } = await supabase
        .from('user_selections')
        .insert({
          user_name: userName,
          club_id: clubId,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          alert('This club has already been selected by another player!');
        } else {
          throw error;
        }
      } else if (data) {
        setUserSelection(data);
      }
    } catch (error) {
      console.error('Error selecting club:', error);
      alert('Failed to select club. Please try again.');
    }
  };

  const handleLimitUpdate = async (newLimit) => {
    if (!configId) return;

    try {
      await supabase
        .from('game_config')
        .update({ player_limit: newLimit, updated_at: new Date().toISOString() })
        .eq('id', configId);
    } catch (error) {
      console.error('Error updating limit:', error);
      alert('Failed to update player limit.');
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!userName) {
    return <UserNameModal onSubmit={handleUserNameSubmit} />;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Football Club Selection</h1>
        <div className="header-controls">
          <p className="welcome">Welcome, {userName}!</p>
          {isAdmin ? (
            <button
              className="toggle-view-btn"
              onClick={() => setIsAdminView(!isAdminView)}
            >
              {isAdminView ? 'View Clubs' : 'Admin Dashboard'}
            </button>
          ) : (
            <button
              className="toggle-view-btn"
              onClick={() => setShowAdminLogin(true)}
            >
              Admin Login
            </button>
          )}
        </div>
      </header>

      <div className="container">
        {isAdminView ? (
          <AdminDashboard />
        ) : (
          <>
            {isAdmin && (
              <PlayerLimitConfig
                currentLimit={playerLimit}
                currentPlayerCount={selections.length}
                onUpdate={handleLimitUpdate}
              />
            )}

            <div className="clubs-grid">
              {clubs.map((club) => {
                const selection = selections.find((s) => s.club_id === club.id);
                const isTaken = !!selection;
                const isSelected = userSelection?.club_id === club.id;

                return (
                  <ClubCard
                    key={club.id}
                    club={club}
                    isSelected={isSelected}
                    isTaken={isTaken && !isSelected}
                    selectedBy={selection?.user_name}
                    onSelect={handleClubSelect}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      {showAdminLogin && (
        <AdminLoginModal
          onLogin={() => {
            setIsAdmin(true);
            setIsAdminView(true);
            setShowAdminLogin(false);
          }}
          onCancel={() => setShowAdminLogin(false)}
        />
      )}
    </div>
  );
}

export default App;
