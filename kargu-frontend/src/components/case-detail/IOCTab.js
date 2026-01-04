import React from 'react';
import { renderTable } from './TableUtils';

const IOCTab = ({ ioc, searchTerm, setSearchTerm }) => {
  return renderTable(
    [
      { key: 'type', label: 'Type' },
      { key: 'value', label: 'Value' },
      { key: 'threat_level', label: 'Threat Level', render: (val) => (
        <span className={`badge badge-${val.toLowerCase()}`}>{val}</span>
      )},
      { key: 'first_seen', label: 'First Seen' },
      { key: 'source', label: 'Source' }
    ],
    ioc
  );
};

export default IOCTab;

