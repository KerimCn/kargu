import React from 'react';
import { renderTable } from './TableUtils';

const DataTab = ({ data, searchTerm, setSearchTerm }) => {
  return renderTable(
    [
      { key: 'timestamp', label: 'Timestamp' },
      { key: 'event', label: 'Event' },
      { key: 'path', label: 'Path' },
      { key: 'status', label: 'Status', render: (val) => (
        <span className={`badge badge-${val.toLowerCase()}`}>{val}</span>
      )}
    ],
    data
  );
};

export default DataTab;

