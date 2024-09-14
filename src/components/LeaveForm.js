import React, { useState } from 'react';
import http from '../services/httpService';

const CreateLeave = () => {
  const [formData, setFormData] = useState({
    partnerId: '',
    startDate: '',
    endDate: '',
    slots: [], // Empty array for the slots
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSlotChange = (e, index) => {
    const updatedSlots = [...formData.slots];
    updatedSlots[index] = e.target.value;
    setFormData({ ...formData, slots: updatedSlots });
  };

  const addSlot = () => {
    setFormData({ ...formData, slots: [...formData.slots, ''] });
  };

  const removeSlot = (index) => {
    const updatedSlots = formData.slots.filter((_, i) => i !== index);
    setFormData({ ...formData, slots: updatedSlots });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clear previous success/error
      setError(null);
      setSuccess(null);

      // Send the leave data to the backend
      const response = await http.post('/leaves', formData);
      
      setSuccess(response.message);
    } catch (err) {
      setError(err.message || 'An error occurred while applying for leave');
    }
  };

  return (
    <div>
      <h2>Apply for Leave</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Partner ID:</label>
          <input
            type="text"
            name="partnerId"
            value={formData.partnerId}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Slots:</label>
          {formData.slots.map((slot, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Day and Time Slot"
                value={slot}
                onChange={(e) => handleSlotChange(e, index)}
              />
              <button type="button" onClick={() => removeSlot(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addSlot}>Add Slot</button>
        </div>

        <button type="submit">Apply Leave</button>
      </form>
    </div>
  );
};

export default CreateLeave;
