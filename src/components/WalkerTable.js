import React from 'react';
// import { FaCheckCircle, FaStar, FaEllipsisV } from 'react-icons/fa';
//import { MdPerson } from 'react-icons/md';

const WalkersTable = () => {
  const walkers = [
    {
      name: 'Bhola Ram',
      verification: 'COMPLETED',
      stateCity: 'Delhi/East Delhi',
      morningCheckin: '-',
      eveningCheckin: '-',
      tag: 'TRAINING',
      rating: '-',
      hotspot: '-',
    },
    {
      name: 'some walker',
      verification: 'COMPLETED',
      stateCity: 'Haryana/Gorakhpur',
      morningCheckin: '-',
      eveningCheckin: '-',
      tag: 'REGULAR',
      rating: '-',
      hotspot: '-',
    },
    {
      name: 'aryan',
      verification: 'COMPLETED',
      stateCity: 'Delhi/Najafgarh',
      morningCheckin: '-',
      eveningCheckin: '-',
      tag: 'TRAINING',
      rating: '4.45 (19)',
      hotspot: '-',
    },
  ];

  return (
    <div className="table-container">
      <h2>Walkers</h2>
      <table className="walkers-table">
        <thead>
          <tr>
            <th>Walkers</th>
            <th>Verification</th>
            <th>State/City</th>
            <th>Morning Checkin</th>
            <th>Evening Checkin</th>
            <th>Tag</th>
            <th>Rating</th>
            <th>Hotspot</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {walkers.map((walker, index) => (
            <tr key={index}>
              <td>
                {/* <MdPerson style={{ marginRight: '10px' }} /> */}
                {walker.name}
              </td>
              <td style={{ color: 'green', fontWeight: 'bold' }}>
                {/* <FaCheckCircle style={{ marginRight: '5px' }} /> */}
                {walker.verification}
              </td>
              <td>{walker.stateCity}</td>
              <td>{walker.morningCheckin}</td>
              <td>{walker.eveningCheckin}</td>
              <td>{walker.tag}</td>
              <td>
                {walker.rating !== '-' && (
                  <>
                    {walker.rating.split(' ')[0]}{' '}
                    {/* <FaStar style={{ color: 'orange', marginLeft: '5px' }} /> */}
                  </>
                )}
              </td>
              <td>{walker.hotspot}</td>
              <td>
                {/* <FaEllipsisV /> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalkersTable;
