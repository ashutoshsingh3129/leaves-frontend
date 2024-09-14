import React, { useState, useEffect } from 'react';
import http from '../services/httpService';
import '../styles/Walker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const Walker = () => {
  const [walkers, setWalkers] = useState([]); 
  const [selectedWalker, setSelectedWalker] = useState(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWalkers();
  }, []);

  const fetchWalkers = async () => {
    setLoading(true); 
    try {
      const response = await http.get(`/walkers`);
      setWalkers(response.data);
    } catch (error) {
      console.error('Error fetching walkers:', error);
    } finally {
      setLoading(false); 
    }
  };

  const fetchWalkerSlots = async (walkerId) => {
    setLoading(true);
    try {
      const response = await http.get(`/walkers/${walkerId}/slots`);
      setSelectedWalker(response.data); 
    } catch (error) {
      console.error('Error fetching walker slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarClick = (walkerId) => {
    fetchWalkerSlots(walkerId);
  };

  return (
    <div className="app-container">
      <h1>Walkers</h1>

      {loading && <p>Loading walkers...</p>}

      <table className="walkers-table">
        <thead>
          <tr>
            <th>Walker</th>
            <th>Verification</th>
            <th>State/City</th>
            <th>Morning Checkin</th>
            <th>Evening Checkin</th>
            <th>Tag</th>
            <th>Rating</th>
            <th>Hotspot</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {walkers.map((walker) => (
  <tr key={walker._id}>
    <td>{walker.name}</td>
    <td className={walker.verificationStatus === 'COMPLETED' ? 'status-completed' : ''}>
      {walker.verificationStatus}
    </td>
    <td>{walker.state}/{walker.city}</td>
    <td>{walker.morningCheckin || '-'}</td>
    <td>{walker.eveningCheckin || '-'}</td>
    <td>{walker.tag}</td>
    <td>{walker.rating || '-'}</td>
    <td>-</td>
    <td>
      <button onClick={() => handleCalendarClick(walker._id)}>
        <FontAwesomeIcon icon={faCalendarAlt} />
      </button>
    </td>
  </tr>
))}

        </tbody>
      </table>

      {selectedWalker && (
        <div className="time-slots-container">
          <h2>{selectedWalker.name}'s Time Slots</h2>
          <table className="time-slots-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time Ranges</th>
              </tr>
            </thead>
            <tbody>
              {selectedWalker.timeSlots.map((slot) => (
                <tr key={slot._id}>
                  <td>{slot.date}</td>
                  <td>
                    {slot.timeRanges.map((range, index) => (
                      <span key={index} className="time-range">{range}</span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Walker;
