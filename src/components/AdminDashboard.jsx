import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './AdminDashboard.css';

function AdminDashboard() {
  const [selections, setSelections] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    subscribeToChanges();
  }, []);

  const loadData = async () => {
    try {
      const [selectionsData, clubsData] = await Promise.all([
        supabase.from('user_selections').select('*').order('selected_at', { ascending: false }),
        supabase.from('clubs').select('*'),
      ]);

      if (selectionsData.data) setSelections(selectionsData.data);
      if (clubsData.data) setClubs(clubsData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('admin_selections')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_selections' },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getClubName = (clubId) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.name : 'Unknown';
  };

  const getClubLeague = (clubId) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.league : '';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDeleteSelection = async (id) => {
    if (confirm('Are you sure you want to remove this selection?')) {
      try {
        await supabase.from('user_selections').delete().eq('id', id);
      } catch (error) {
        console.error('Error deleting selection:', error);
        alert('Failed to delete selection');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div className="stats">
          <div className="stat-card">
            <span className="stat-value">{selections.length}</span>
            <span className="stat-label">Total Selections</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{clubs.length - selections.length}</span>
            <span className="stat-label">Available Clubs</span>
          </div>
        </div>
      </div>

      {selections.length === 0 ? (
        <div className="empty-state">
          <p>No selections yet</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="selections-table">
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Club Selected</th>
                <th>League</th>
                <th>Selected At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selections.map((selection) => (
                <tr key={selection.id}>
                  <td className="player-name">{selection.user_name}</td>
                  <td className="club-name">{getClubName(selection.club_id)}</td>
                  <td className="league">{getClubLeague(selection.club_id)}</td>
                  <td className="date">{formatDate(selection.selected_at)}</td>
                  <td className="actions">
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteSelection(selection.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
