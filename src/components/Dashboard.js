import React, { useEffect, useState } from 'react';
import '../styles/LeaveForm.css'; // Custom CSS for styling
import Modal from './Modal'; // Import the Modal component
import '../styles/LeaveTable.css';
import http from '../services/httpService';

const LeaveForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // New state to differentiate between Add/Edit mode
  const [selectedLeave, setSelectedLeave] = useState(null); // Store the leave to edit
  const [leave, setLeave] = useState([]); // Store the leave to edit
  const [partners, setPartners] = useState([]); // Store the leave to edit
  const [editLeaveId, setEditLeaveId] = useState(null); // Store the ID of the leave being edited
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    partnerId: '',
    reason: '',
    startDate: '',
    endDate: '',
    slotType: '',
    slots: [], // For storing multiple selected slots
    removePenalty: false,
    status: '', // For editing status in Edit mode
  });


  const slots = [
    '7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00',
    '11:00 - 12:00', '12:00 - 1:00', '1:00 - 2:00', '2:00 - 3:00','3:00 - 4:00','4:00 - 5:00'
  ];

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  const getLeaves = async () => {
    let response = await http.get('/leaves')
    console.log("res", response)
    setLeave(response.data)
    return response

  }
  const getPartners = async () => {
    let response = await http.get('/partners')
    console.log("res", response)
    setPartners(response.data)
    return response
  }
  useEffect(() => {
    getLeaves()
    getPartners()
  }, [])
  // Handle slot selection (allow multiple selections)
  const handleSlotSelect = (e) => {
    const selectedSlot = e.target.value;
    if (formData.slots.includes(selectedSlot)) return; // Avoid duplicate selections

    setFormData({
      ...formData,
      slots: [...formData.slots, selectedSlot], // Add selected slot to the list
    });
  };

  // Handle removing a slot
  const handleRemoveSlot = (slotToRemove) => {
    setFormData({
      ...formData,
      slots: formData.slots.filter((slot) => slot !== slotToRemove),
    });
  };

  // Check if start date and end date are the same
  const isSameDate = formData.startDate && formData.endDate && formData.startDate === formData.endDate;

  const handleCreate = async (e) => {
    e.preventDefault();
    const { partnerId, startDate, endDate, slots } = formData;

    if (!partnerId || !startDate || !endDate || (isSameDate && slots.length === 0)) {
      alert('Please fill in all required fields!');
      return;
    }
    e.preventDefault();
    let payload = {
      slots,
      partnerId,
      startDate,
      endDate
    }
    try {

      // Clear previous success/error
      // setError(null);
      // setSuccess(null);

      // Send the leave data to the backend
      console.log(payload)
      const response = await http.post('/leaves', payload);

      setSuccess(response.message);
    } catch (err) {
      setError(err.message || 'An error occurred while applying for leave');
    }
    // Handle form submission logic here for Add
    console.log('Leave Created:', formData);
    setIsModalOpen(false); // Close modal after submission
    getLeaves()
  };

  const handleEdit = async (leave) => {
    setIsEditMode(true); // Switch to Edit Mode
    setEditLeaveId(leave._id); // Store the leave ID for patch request

    // Format startDate and endDate to 'YYYY-MM-DD' format
    const formattedStartDate = new Date(leave.startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(leave.endDate).toISOString().split('T')[0];

    setFormData({
      partnerId: leave.partner._id, // Pre-fill partnerId
      reason: leave.reason || '', // Pre-fill reason if available
      startDate: formattedStartDate, // Pre-fill formatted startDate
      endDate: formattedEndDate, // Pre-fill formatted endDate
      status: leave.status, // Pre-fill status
      removePenalty: leave.removePenalty || false, // Pre-fill removePenalty if available
      slots: leave.slots || [], // Pre-fill slots
    });

    setIsModalOpen(true); // Open modal
  };


  const handleUpdate = async (e) => {
    e.preventDefault();

    const { startDate, endDate, status, slots: selectedSlots, removePenalty } = formData;

    if (!startDate || !endDate || !status || (isSameDate && selectedSlots.length === 0)) {
      alert('Please fill in all required fields!');
      return;
    }

    try {
      // Send the updated leave data to the backend using the stored leave ID
      const response = await http.patch(`/leaves/${editLeaveId}`, {
        startDate,
        endDate,
        status,
        slots: selectedSlots,
        removePenalty,
      });

      console.log('Leave Updated:', response.data);
      setIsModalOpen(false); // Close modal after submission
    } catch (err) {
      console.error('Error updating leave:', err);
    }
    getLeaves()
  };
  const handleAdd = () => {
    setIsEditMode(false); // Switch to Add Mode
    setFormData({
      partnerId: '',
      reason: '',
      startDate: '',
      endDate: '',
      slotType: '',
      slots: [],
      removePenalty: false,
      status: '',
    });
    setIsModalOpen(true); // Open modal
  };

  const handleDelete = (id) => {
    let response = http.delete('/leaves/' + id)
    alert(`Delete leave for ${id}`);
    getLeaves()
  };

  return (
    <div>
      <button className="add-button" onClick={handleAdd}>
        Add Leave
      </button>
      {error}
      {success}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* Conditionally render form based on Add or Edit mode */}
        {!isEditMode ? (
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Select Walker *</label>
              {partners.length > 0 && (
                <select
                  name="partnerId"
                  value={formData.partnerId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Walker</option>
                  {partners.map((partner) => (
                    <option key={partner._id} value={partner._id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              )}


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
                {/* <div className="form-group">
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
                </div> */}

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
                    {formData.slots.map((slot, index) => (
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
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="removePenalty"
                  checked={formData.removePenalty}
                  onChange={handleChange}
                />
              </label>
              Want to Remove Penalty?
            </div>
            <button type="submit" className="submit-btn">Create</button>
          </form>
        ) : (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              {console.log("form", formData)}
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
                {/* <div className="form-group">
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
                </div> */}

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
                    {formData.slots.map((slot, index) => (
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
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="removePenalty"
                  checked={formData.removePenalty}
                  onChange={handleChange}
                />
              </label>
              Want to Remove Penalty?
            </div>

            <button type="submit" className="submit-btn">Update</button>
          </form>
        )}
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
            {leave?.map((leave, index) => {
              const formatDateTime = (date) => {
                return new Date(date).toLocaleString('en-US', {
                  timeZone: 'Asia/Kolkata',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
                });
              };

              return (
                <tr key={index}>
                  <td>{leave.partner.name}</td>
                  <td>{leave.partner.city}</td>
                  <td>{formatDateTime(leave.createdAt)}</td>
                  <td>{formatDateTime(leave.startDate)}</td>
                  <td>{formatDateTime(leave.endDate)}</td>
                  <td>
                    <span className={leave.status === 'APPROVED' ? 'approved' : 'pending'}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(leave)} className="edit-btn">✎</button>
                    <button onClick={() => handleDelete(leave._id)} className="delete-btn">🗑</button>
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveForm;
