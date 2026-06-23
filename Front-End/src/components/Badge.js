import React from 'react';

export default function Badge({ value }) {
  if (!value) return <span style={{ color: '#9ca3af' }}>—</span>;
  return <span className={`badge badge-${value}`}>{value.replace('_', ' ')}</span>;
}
