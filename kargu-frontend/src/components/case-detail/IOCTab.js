import React, { useState } from 'react';
import { RenderTable } from './TableUtils';

const IOCTab = ({ ioc }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <RenderTable
      columns={[
        { key: 'type', label: 'Type' },
        { key: 'value', label: 'Value' },
        { key: 'threat_level', label: 'Threat Level', render: (val) => (
          <span className={`badge badge-${val.toLowerCase()}`}>{val}</span>
        )},
        { key: 'first_seen', label: 'First Seen' },
        { key: 'source', label: 'Source' }
      ]}
      data={ioc}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
};

export default IOCTab;

