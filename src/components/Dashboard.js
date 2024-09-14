import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import Modal from './Modal';
import '../styles/LeaveTable.css';
import http from '../services/httpService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [leave, setLeave] = useState([]);
  const [partners, setPartners] = useState([]);
  const [editLeaveId, setEditLeaveId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    partnerId: '',
    reason: '',
    startDate: '',
    endDate: '',
    slotType: '',
    slots: [],
    removePenalty: false,
    status: '',
  });


  const slots = [
    '7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00',
    '11:00 - 12:00', '12:00 - 1:00', '1:00 - 2:00', '2:00 - 3:00', '3:00 - 4:00', '4:00 - 5:00'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  const getLeaves = async () => {
    try {
      setIsLoading(true);
      let response = await http.get('/leaves')
      if (response.data) setLeave(response.data.data)
              setIsLoading(false);

      return response
    } catch (err) {
      console.log("ee", err)
      setIsLoading(false);
      toast.error(err.message || 'An error occurred while feching leave');
    }

  }
  const getPartners = async () => {
    try {
      setIsLoading(true);
      let response = await http.get('/partners')
      if (response.data) setPartners(response.data)
        setIsLoading(false);
      return response
    } catch (err) {
      setIsLoading(false);
      toast.error(err.message || 'An error occurred while feching partners');
    }
  }
  useEffect(() => {
    getLeaves()
    getPartners()
  }, [])
  const handleSlotSelect = (e) => {
    const selectedSlot = e.target.value;
    if (formData.slots.includes(selectedSlot)) return;
    setFormData({
      ...formData,
      slots: [...formData.slots, selectedSlot],
    });
  };

  const handleRemoveSlot = (slotToRemove) => {
    setFormData({
      ...formData,
      slots: formData.slots.filter((slot) => slot !== slotToRemove),
    });
  };

  const isSameDate = formData.startDate && formData.endDate && formData.startDate === formData.endDate;

  const handleCreate = async (e) => {
    e.preventDefault();
    const { partnerId, startDate, endDate, slots } = formData;

    if (!partnerId || !startDate || !endDate || (isSameDate && slots.length === 0)) {
      toast.error('Please fill in all required fields!');
      return;
    }

    let payload = { slots, partnerId, startDate, endDate };

    try {
      await http.post('/leaves', payload);
      toast.success('Leave added successfully');
      setIsModalOpen(false);
      getLeaves();
    } catch (err) {
      toast.error(err.message || 'An error occurred while applying for leave');
      setIsModalOpen(false);

    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { startDate, endDate, status, slots: selectedSlots, removePenalty } = formData;

    if (!startDate || !endDate || !status || (isSameDate && selectedSlots.length === 0)) {
      toast.error('Please fill in all required fields!');
      return;
    }

    try {
      await http.patch(`/leaves/${editLeaveId}`, { startDate, endDate, status, slots: selectedSlots, removePenalty });
      toast.success('Leave updated successfully');
      setIsModalOpen(false);
      getLeaves();
    } catch (err) {
      toast.error(err.message || 'Error updating leave');
      setIsModalOpen(false);
    }
  };


  const handleEdit = async (leave) => {
    setIsEditMode(true);
    setEditLeaveId(leave._id);

    const formattedStartDate = new Date(leave.startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(leave.endDate).toISOString().split('T')[0];

    setFormData({
      partnerId: leave.partner._id,
      reason: leave.reason || '',
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      status: leave.status,
      removePenalty: leave.removePenalty || false,
      slots: leave.slots || [],
    });

    setIsModalOpen(true);
  };



  const handleAdd = () => {
    setIsEditMode(false);
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
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await http.delete('/leaves/' + id)
    } catch (err) {
      toast.error(err.message || 'Error updating leave');
    }
    getLeaves()
  };

  return (
    <>
     <a href="/walker" className="button-link">Go to Walker Tab</a>
      {isLoading ? (
        <div className="loader-overlay">
          <div className="loader"></div>
          <div className="loader-text">Loading data, please wait...</div>
        </div>
      ) : (
        <>
          <button className="add-button" onClick={handleAdd}>
            Add Leave
          </button>
  
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
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
                      {partners?.map((partner) => (
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
            <h1>Leaves</h1>
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
                  const formatDateTime = (date, utc) => {
                    let conf = {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    };
  
                    if (utc) {
                      conf['timeZone'] = 'UTC';
                    }
                    return new Date(date).toLocaleString('en-US', conf);
                  };
  
                  return (
                    <tr key={index}>
                      <td>{leave?.partner?.name || 'N/A'}</td>
                      <td>{leave?.partner?.city || 'N/A'}</td>
                      <td>{formatDateTime(leave?.createdAt, false)}</td>
                      <td>{formatDateTime(leave?.startDate, true)}</td>
                      <td>{formatDateTime(leave?.endDate, true)}</td>
                      <td>
                        <span className={leave?.status === 'APPROVED' ? 'approved' : 'pending'}>
                          {leave?.status || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleEdit(leave)} className="edit-btn">✎</button>
                        <button onClick={() => handleDelete(leave?._id)} className="delete-btn">🗑</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
export default Dashboard  