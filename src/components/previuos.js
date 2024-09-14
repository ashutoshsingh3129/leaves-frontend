import React, { useState } from 'react';
import '../styles/LeaveForm.css'; // Custom CSS for styling
import Modal from './Modal'; // Import the Modal component
import '../styles/LeaveTable.css'
const LeaveForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    walker: '',
    reason: '',
    startDate: '',
    endDate: '',
    slotType: '',
    selectedSlots: [], // For storing multiple selected slots
    removePenalty: false,
  });
  const leaveData = [
    {
      name: 'Bhola Ram',
      city: 'East Delhi',
      appliedDate: 'June 23, 2024 at 2:28 AM',
      startDate: 'May 5, 2024 at 12:00 AM',
      endDate: 'May 7, 2024 at 12:00 AM',
      status: 'PENDING',
    },
    {
      name: 'Aaryan',
      city: 'Gurgaon',
      appliedDate: 'May 28, 2024 at 12:06 PM',
      startDate: 'June 28, 2024 at 12:00 AM',
      endDate: 'June 30, 2024 at 11:59 PM',
      status: 'APPROVED',
    },
    {
      name: 'Jaipal',
      city: 'West Delhi',
      appliedDate: 'May 28, 2024 at 1:45 PM',
      startDate: 'May 28, 2024 at 12:00 AM',
      endDate: 'May 29, 2024 at 11:59 PM',
      status: 'APPROVED',
    },
  ];
  const slots = [
    '7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00',
    '16:00 - 17:00', '17:00 - 18:00', '20:00 - 21:00', '21:00 - 22:30'
  ];

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle slot selection (allow multiple selections)
  const handleSlotSelect = (e) => {
    const selectedSlot = e.target.value;
    if (formData.selectedSlots.includes(selectedSlot)) return; // Avoid duplicate selections

    setFormData({
      ...formData,
      selectedSlots: [...formData.selectedSlots, selectedSlot], // Add selected slot to the list
    });
  };

  // Handle removing a slot
  const handleRemoveSlot = (slotToRemove) => {
    setFormData({
      ...formData,
      selectedSlots: formData.selectedSlots.filter((slot) => slot !== slotToRemove),
    });
  };

  // Check if start date and end date are the same
  const isSameDate = formData.startDate && formData.endDate && formData.startDate === formData.endDate;

  const handleCreate = (e) => {
    e.preventDefault();
    const { walker, startDate, endDate, selectedSlots } = formData;

    if (!walker || !startDate || !endDate || (isSameDate && selectedSlots.length === 0)) {
      alert('Please fill in all required fields!');
      return;
    }

    // Handle form submission logic here
    console.log('Leave Created:', formData);
    setIsModalOpen(false); // Close modal after submission
  };
  const handleEdit = (name) => {
    alert(`Edit leave for ${name}`);
  };

  const handleDelete = (name) => {
    alert(`Delete leave for ${name}`);
  };

  return (
    <div>
      <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>
        Add/Edit Leave
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Select Walker *</label>
            <select
              name="walker"
              value={formData.walker}
              onChange={handleChange}
              required
            >
              <option value="">Select Walker</option>
              <option value="aryan">Aryan</option>
              {/* Add more options as needed */}
            </select>
          </div>

          <div className="form-group">
            <label>Add Reason</label>
            <input
              type="text"
              name="reason"
              placeholder="Add Reason"
              value={formData.reason}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          {isSameDate && (
            <>
              <div className="form-group">
                <label>Select Slot Type</label>
                <select
                  name="slotType"
                  value={formData.slotType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Slot Type</option>
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                </select>
              </div>

              <div className="form-group">
                <label>Select Slot(s)</label>
                <select onChange={handleSlotSelect} value="">
                  <option value="">Select Slot</option>
                  {slots.map((timeSlot, index) => (
                    <option key={index} value={timeSlot}>
                      {timeSlot}
                    </option>
                  ))}
                </select>

                {/* Display Selected Slots as Chips */}
                <div className="selected-slots">
                  {formData.selectedSlots.map((slot, index) => (
                    <div key={index} className="chip">
                      {slot}
                      <span
                        className="closebtn"
                        onClick={() => handleRemoveSlot(slot)}
                      >
                        &times;
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="removePenalty"
                checked={formData.removePenalty}
                onChange={handleChange}
              />
              Want to Remove Penalty?
            </label>
          </div>

          <button type="submit" className="submit-btn">Create</button>
        </form>
      </Modal>
      <div>
      <h1>Leave</h1>
      <table className="leave-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Applied Date</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveData.map((leave, index) => (
            <tr key={index}>
              <td>{leave.name}</td>
              <td>{leave.city}</td>
              <td>{leave.appliedDate}</td>
              <td>{leave.startDate}</td>
              <td>{leave.endDate}</td>
              <td>
                <span className={leave.status === 'APPROVED' ? 'approved' : 'pending'}>
                  {leave.status}
                </span>
              </td>
              <td>
                <button onClick={() => handleEdit(leave.name)} className="edit-btn">✎</button>
                <button onClick={() => handleDelete(leave.name)} className="delete-btn">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </div>
  );
};

export default LeaveForm;
