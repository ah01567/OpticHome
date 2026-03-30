import { useMemo, useState } from 'react';
import './ClientsPage.css';

const initialClients = [
  {
    id: 'CL-1001',
    name: 'Sarah Johnson',
    dob: '1992-06-14',
    phone: '+44 7700 900123',
    notes: 'Prefers thin metal frames',
    createdAt: '2026-03-30',
    updatedAt: '2026-03-30',
  },
  {
    id: 'CL-1002',
    name: 'Daniel Moore',
    dob: '1988-11-02',
    phone: '+44 7700 900456',
    notes: 'Sensitive to heavy acetate temples',
    createdAt: '2026-03-28',
    updatedAt: '2026-03-30',
  },
  {
    id: 'CL-1003',
    name: 'Amira Patel',
    dob: '1996-01-25',
    phone: '+44 7700 900789',
    notes: 'Wants anti-reflective coating on every order',
    createdAt: '2026-03-25',
    updatedAt: '2026-03-29',
  },
  {
    id: 'CL-1004',
    name: 'Lucas Bennett',
    dob: '1979-09-09',
    phone: '+44 7700 901112',
    notes: 'Prefers dark neutral tones',
    createdAt: '2026-03-22',
    updatedAt: '2026-03-29',
  },
];

const emptyForm = {
  name: '',
  dob: '',
  phone: '',
  notes: '',
};

function ClientsPage() {
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [clients, setClients] = useState(initialClients);
  const [clientSearch, setClientSearch] = useState('');
  const [clientFormData, setClientFormData] = useState(emptyForm);
  const [clientFormErrors, setClientFormErrors] = useState({});

  const filteredClients = useMemo(() => {
    const query = clientSearch.trim().toLowerCase();
    if (!query) return clients;

    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) ||
        client.phone.toLowerCase().includes(query) ||
        client.id.toLowerCase().includes(query)
    );
  }, [clientSearch, clients]);
  const displayCell = (value) =>
    value === undefined || value === null || value === '' ? '-' : value;

  const openModal = () => {
    setIsAddClientModalOpen(true);
    setEditingClientId(null);
    setClientFormData(emptyForm);
    setClientFormErrors({});
  };

  const openClientDetailsModal = (client) => {
    setIsAddClientModalOpen(true);
    setEditingClientId(client.id);
    setClientFormData({
      name: client.name || '',
      dob: client.dob && client.dob !== '-' ? client.dob : '',
      phone: client.phone || '',
      notes: client.notes && client.notes !== '-' ? client.notes : '',
    });
    setClientFormErrors({});
  };

  const closeModal = () => {
    setIsAddClientModalOpen(false);
    setIsDeleteConfirmOpen(false);
    setEditingClientId(null);
    setClientFormData(emptyForm);
    setClientFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setClientFormData((prev) => ({ ...prev, [field]: value }));
    setClientFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const errors = {};

    if (!clientFormData.name.trim()) errors.name = 'Name is required.';
    if (!clientFormData.phone.trim()) errors.phone = 'Phone is required.';

    return errors;
  };

  const handleSaveClient = (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setClientFormErrors(errors);
      return;
    }

    const now = new Date().toISOString().slice(0, 10);
    if (editingClientId) {
      setClients((prev) =>
        prev.map((client) =>
          client.id === editingClientId
            ? {
                ...client,
                name: clientFormData.name.trim(),
                dob: clientFormData.dob || '-',
                phone: clientFormData.phone.trim(),
                notes: clientFormData.notes.trim() || '-',
                updatedAt: now,
              }
            : client
        )
      );
    } else {
      const generatedId = `CL-${Date.now().toString().slice(-6)}`;
      const newClient = {
        id: generatedId,
        name: clientFormData.name.trim(),
        dob: clientFormData.dob || '-',
        phone: clientFormData.phone.trim(),
        notes: clientFormData.notes.trim() || '-',
        createdAt: now,
        updatedAt: now,
      };

      setClients((prev) => [newClient, ...prev]);
    }
    closeModal();
  };

  const openDeleteConfirm = () => {
    if (!editingClientId) return;
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteClient = () => {
    if (!editingClientId) return;
    setClients((prev) => prev.filter((client) => client.id !== editingClientId));
    setIsDeleteConfirmOpen(false);
    closeModal();
  };

  return (
    <section className="clients-page">
      <header className="clients-header">
        <h3 className="section-title title-with-icon">
          <svg className="page-title-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.5 19.5h15v-1.8a3 3 0 0 0-3-3h-9a3 3 0 0 0-3 3z" />
            <circle cx="12" cy="8.5" r="3.2" />
          </svg>
          <span>Clients</span>
        </h3>

        <button type="button" className="add-client-btn" onClick={openModal}>
          New Client
        </button>
      </header>

      <div className="clients-toolbar">
        <input
          type="text"
          className="clients-search"
          placeholder="Search by name, phone, or ID"
          value={clientSearch}
          onChange={(event) => setClientSearch(event.target.value)}
        />
      </div>

      <section className="clients-table-shell">
        <table className="clients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>DOB</th>
              <th>Phone</th>
              <th>Notes</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id} onClick={() => openClientDetailsModal(client)}>
                  <td>{displayCell(client.id)}</td>
                  <td>{displayCell(client.name)}</td>
                  <td>{displayCell(client.dob)}</td>
                  <td>{displayCell(client.phone)}</td>
                  <td className="notes-cell" title={displayCell(client.notes)}>
                    {displayCell(client.notes)}
                  </td>
                  <td>{displayCell(client.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No clients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {isAddClientModalOpen && (
        <div className="modal-overlay" role="presentation" onClick={closeModal}>
          <section
            className="client-modal"
            role="dialog"
            aria-modal="true"
            aria-label={editingClientId ? 'Client Details' : 'Add New Client'}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <div className="modal-title-wrap">
                <h2>{editingClientId ? 'Client Details' : 'New Client'}</h2>
              </div>
              <button
                type="button"
                className="client-close-btn"
                onClick={closeModal}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            <form className="client-form" onSubmit={handleSaveClient}>
              <div className="form-column">
                <label className="field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={clientFormData.name}
                    onChange={(event) => handleInputChange('name', event.target.value)}
                  />
                  {clientFormErrors.name && (
                    <small className="field-error">{clientFormErrors.name}</small>
                  )}
                </label>

                <div className="split-fields">
                  <label className="field">
                    <span>DOB</span>
                    <input
                      type="date"
                      value={clientFormData.dob}
                      onChange={(event) => handleInputChange('dob', event.target.value)}
                    />
                  </label>

                  <label className="field">
                    <span>Phone</span>
                    <input
                      type="text"
                      value={clientFormData.phone}
                      onChange={(event) => handleInputChange('phone', event.target.value)}
                    />
                    {clientFormErrors.phone && (
                      <small className="field-error">{clientFormErrors.phone}</small>
                    )}
                  </label>
                </div>

                <label className="field">
                  <span>Notes</span>
                  <textarea
                    value={clientFormData.notes}
                    onChange={(event) => handleInputChange('notes', event.target.value)}
                  />
                </label>

                <div className="modal-actions">
                  {editingClientId && (
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={openDeleteConfirm}
                    >
                      Delete
                      <svg className="delete-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M4 7h16" />
                        <path d="M9.5 4.5h5L15 7H9l.5-2.5z" />
                        <path d="M8 7l.7 11h6.6L16 7" />
                        <path d="M10 10.5v5.5M14 10.5v5.5" />
                      </svg>
                    </button>
                  )}
                  <button type="button" className="cancel-btn" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    {editingClientId ? 'Update Client' : 'Save Client'}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      )}

      {isDeleteConfirmOpen && editingClientId && (
        <div
          className="confirm-overlay"
          role="presentation"
          onClick={closeDeleteConfirm}
        >
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm client deletion"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>Delete client?</h3>
            <p>This client will be removed from the list.</p>
            <div className="confirm-actions">
              <button
                type="button"
                className="confirm-cancel-btn"
                onClick={closeDeleteConfirm}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-delete-btn"
                onClick={handleDeleteClient}
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default ClientsPage;
