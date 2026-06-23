import React from 'react';

export default function Modal({ title, onClose, children, width }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={width ? { width } : {}} onClick={(e) => e.stopPropagation()}>
        <div className="modal-hdr">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
