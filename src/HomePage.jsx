import { useMemo, useState } from 'react';
import ClientsPage from './ClientsPage';
import GlassesPage from './GlassesPage';
import './HomePage.css';

const analytics = [
  { label: 'Total Frame Types', value: '124' },
  { label: 'Total Clients', value: '86' },
  { label: 'Total Monthly Sales', value: '£3,120' },
  { label: 'Total Sales', value: '£12,480' },
];

const initialSales = [
  {
    id: 'S-1001',
    glassesID: 'G-204',
    clientID: 'C-011',
    originalPrice: '£280',
    paidAmount: '£120',
    deliveryDate: '2026-04-03',
    createdAt: '2026-03-25',
    updatedAt: '2026-03-28',
    state: 'Pending',
    notes: '',
  },
  {
    id: 'S-1002',
    glassesID: 'G-167',
    clientID: 'C-004',
    originalPrice: '£340',
    paidAmount: '£340',
    deliveryDate: '2026-03-30',
    createdAt: '2026-03-22',
    updatedAt: '2026-03-30',
    state: 'Delivered',
    notes: '',
  },
  {
    id: 'S-1003',
    glassesID: 'G-095',
    clientID: 'C-019',
    originalPrice: '£220',
    paidAmount: '£80',
    deliveryDate: '2026-04-08',
    createdAt: '2026-03-26',
    updatedAt: '2026-03-27',
    state: 'Ready',
    notes: '',
  },
  {
    id: 'S-1004',
    glassesID: 'G-322',
    clientID: 'C-007',
    originalPrice: '£410',
    paidAmount: '£200',
    deliveryDate: '2026-04-10',
    createdAt: '2026-03-29',
    updatedAt: '2026-03-29',
    state: 'Cancelled',
    notes: '',
  },
];

const initialClients = [
  {
    clientID: 'C-004',
    fullName: 'Lina Moreau',
    phone: '+44 7123 019011',
    lastVisit: '2026-03-18',
  },
  {
    clientID: 'C-007',
    fullName: 'Noah Bennett',
    phone: '+44 7133 552104',
    lastVisit: '2026-03-21',
  },
  {
    clientID: 'C-011',
    fullName: 'Maya El Idrissi',
    phone: '+44 7998 321402',
    lastVisit: '2026-03-27',
  },
  {
    clientID: 'C-019',
    fullName: 'Adam Laurent',
    phone: '+44 7450 908314',
    lastVisit: '2026-03-29',
  },
];

const glassesModels = [
  { id: 'G-204', name: 'Classic Black Round', price: 120 },
  { id: 'G-167', name: 'Matte Silver Square', price: 145 },
  { id: 'G-095', name: 'Tortoise Soft Oval', price: 132 },
  { id: 'G-322', name: 'Champagne Thin Rim', price: 165 },
  { id: 'G-401', name: 'Midnight Titanium Slim', price: 189 },
  { id: 'G-278', name: 'Heritage Browline', price: 154 },
];

const pages = [
  { id: 'Dashboard Page', icon: 'dashboard' },
  { id: 'Glasses Page', icon: 'glasses' },
  { id: 'Clients Page', icon: 'clients' },
];

function SidebarIcon({ type }) {
  if (type === 'dashboard') {
    return (
      <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
        <rect x="13.5" y="3.5" width="7" height="5" rx="1.6" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
        <rect x="13.5" y="10.5" width="7" height="10" rx="1.6" />
      </svg>
    );
  }

  if (type === 'glasses') {
    return (
      <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="7.5" cy="13" r="3.7" />
        <circle cx="16.5" cy="13" r="3.7" />
        <path d="M3.8 10.8h3M17.2 10.8h3M11 13h2" />
      </svg>
    );
  }

  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 19.5h15v-1.8a3 3 0 0 0-3-3h-9a3 3 0 0 0-3 3z" />
      <circle cx="12" cy="8.5" r="3.2" />
    </svg>
  );
}

function HomePage({ onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard Page');
  const [language, setLanguage] = useState('English');
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [saleModalStep, setSaleModalStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState(initialClients);
  const [clientSearch, setClientSearch] = useState('');
  const [glassesSearch, setGlassesSearch] = useState('');
  const [isGlassesDropdownOpen, setIsGlassesDropdownOpen] = useState(false);
  const [saleForm, setSaleForm] = useState({
    glassesModel: '',
    glassPrice: '',
    notes: '',
    clientPaidAmount: '',
    deliveryDate: '',
  });
  const [isInlineClientModalOpen, setIsInlineClientModalOpen] = useState(false);
  const [inlineClientFormData, setInlineClientFormData] = useState({
    name: '',
    dob: '',
    phone: '',
    notes: '',
  });
  const [inlineClientFormErrors, setInlineClientFormErrors] = useState({});
  const [salesData, setSalesData] = useState(initialSales);
  const [isSaleDetailsModalOpen, setIsSaleDetailsModalOpen] = useState(false);
  const [saleDetailsForm, setSaleDetailsForm] = useState({
    id: '',
    glassesID: '',
    clientID: '',
    originalPrice: '',
    notes: '',
    paidAmount: '',
    deliveryDate: '',
    createdAt: '',
    state: 'Pending',
  });
  const [isSaleDetailsGlassesOpen, setIsSaleDetailsGlassesOpen] = useState(false);
  const [saleDetailsGlassesSearch, setSaleDetailsGlassesSearch] = useState('');

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date()),
    []
  );

  const openSaleModal = () => {
    setIsSaleModalOpen(true);
    setSaleModalStep(1);
    setSelectedClient(null);
    setClientSearch('');
    setGlassesSearch('');
    setIsGlassesDropdownOpen(false);
    setSaleForm({
      glassesModel: '',
      glassPrice: '',
      notes: '',
      clientPaidAmount: '',
      deliveryDate: '',
    });
    setIsInlineClientModalOpen(false);
    setInlineClientFormData({
      name: '',
      dob: '',
      phone: '',
      notes: '',
    });
    setInlineClientFormErrors({});
  };

  const closeSaleModal = () => {
    setIsSaleModalOpen(false);
    setSaleModalStep(1);
    setClientSearch('');
    setGlassesSearch('');
    setIsGlassesDropdownOpen(false);
    setIsInlineClientModalOpen(false);
    setSaleForm({
      glassesModel: '',
      glassPrice: '',
      notes: '',
      clientPaidAmount: '',
      deliveryDate: '',
    });
    setInlineClientFormData({
      name: '',
      dob: '',
      phone: '',
      notes: '',
    });
    setInlineClientFormErrors({});
  };

  const openInlineClientModal = () => {
    setIsInlineClientModalOpen(true);
    setInlineClientFormErrors({});
  };

  const closeInlineClientModal = () => {
    setIsInlineClientModalOpen(false);
    setInlineClientFormData({
      name: '',
      dob: '',
      phone: '',
      notes: '',
    });
    setInlineClientFormErrors({});
  };

  const saveInlineClient = (event) => {
    event.preventDefault();
    const errors = {};

    if (!inlineClientFormData.name.trim()) errors.name = 'Name is required.';
    if (!inlineClientFormData.phone.trim()) errors.phone = 'Phone is required.';

    if (Object.keys(errors).length > 0) {
      setInlineClientFormErrors(errors);
      return;
    }

    const now = new Date().toISOString().slice(0, 10);
    const newClient = {
      clientID: `C-${Date.now().toString().slice(-3).padStart(3, '0')}`,
      fullName: inlineClientFormData.name.trim(),
      phone: inlineClientFormData.phone.trim(),
      lastVisit: now,
    };

    setClients((prev) => [newClient, ...prev]);
    setSelectedClient(newClient);
    closeInlineClientModal();
  };

  const handleSaleSave = () => {
    const payload = {
      selectedClient: selectedClient
        ? {
            clientID: selectedClient.clientID,
            fullName: selectedClient.fullName,
          }
        : { clientID: null, fullName: 'Guest client' },
      sale: {
        glassesModel: saleForm.glassesModel.trim(),
        glassPrice: saleForm.glassPrice,
        notes: saleForm.notes.trim(),
        clientPaidAmount: saleForm.clientPaidAmount,
        deliveryDate: saleForm.deliveryDate,
      },
    };

    console.log('Sale saved:', payload);
    closeSaleModal();
  };

  const openSaleDetailsModal = (sale) => {
    const matchedModel = glassesModels.find(
      (model) => model.id === sale.glassesID || model.name === sale.glassesID
    );
    const resolvedModelId = matchedModel?.id || sale.glassesID;
    setSaleDetailsForm({
      id: sale.id || '',
      glassesID: resolvedModelId || '',
      clientID: sale.clientID || '',
      originalPrice: sale.originalPrice || '',
      notes: sale.notes || '',
      paidAmount: sale.paidAmount || '',
      deliveryDate: sale.deliveryDate || '',
      createdAt: sale.createdAt || '',
      state: sale.state || 'Pending',
    });
    setSaleDetailsGlassesSearch('');
    setIsSaleDetailsGlassesOpen(false);
    setIsSaleDetailsModalOpen(true);
  };

  const closeSaleDetailsModal = () => {
    setIsSaleDetailsModalOpen(false);
    setSaleDetailsGlassesSearch('');
    setIsSaleDetailsGlassesOpen(false);
    setSaleDetailsForm({
      id: '',
      glassesID: '',
      clientID: '',
      originalPrice: '',
      notes: '',
      paidAmount: '',
      deliveryDate: '',
      createdAt: '',
      state: 'Pending',
    });
  };

  const handleSaleDetailsChange = (field, value) => {
    setSaleDetailsForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaleDetailsSave = () => {
    const now = new Date().toISOString().slice(0, 10);
    setSalesData((prev) =>
      prev.map((sale) =>
        sale.id === saleDetailsForm.id
          ? {
              ...sale,
              glassesID: saleDetailsForm.glassesID.trim(),
              clientID: saleDetailsForm.clientID,
              originalPrice: saleDetailsForm.originalPrice.trim(),
              notes: saleDetailsForm.notes.trim(),
              paidAmount: saleDetailsForm.paidAmount.trim(),
              deliveryDate: saleDetailsForm.deliveryDate,
              state: saleDetailsForm.state,
              updatedAt: now,
            }
          : sale
      )
    );
    closeSaleDetailsModal();
  };

  const handleSaleDelete = () => {
    setSalesData((prev) => prev.filter((sale) => sale.id !== saleDetailsForm.id));
    closeSaleDetailsModal();
  };

  const pageTitle = activePage;
  const filteredClients = clients.filter((client) => {
    const query = clientSearch.trim().toLowerCase();
    if (!query) return true;

    return (
      client.clientID.toLowerCase().includes(query) ||
      client.fullName.toLowerCase().includes(query) ||
      client.phone.toLowerCase().includes(query)
    );
  });
  const filteredGlassesModels = glassesModels.filter((model) =>
    model.name.toLowerCase().includes(glassesSearch.trim().toLowerCase())
  );
  const clientNameById = useMemo(
    () =>
      Object.fromEntries(
        clients.map((client) => [client.clientID, client.fullName])
      ),
    [clients]
  );
  const selectedGlassesModel = glassesModels.find(
    (model) => model.name === saleForm.glassesModel
  );
  const filteredSaleDetailsGlassesModels = glassesModels.filter((model) =>
    model.name
      .toLowerCase()
      .includes(saleDetailsGlassesSearch.trim().toLowerCase())
  );
  const selectedSaleDetailsGlassesModel = glassesModels.find(
    (model) => model.id === saleDetailsForm.glassesID
  );
  const displayCell = (value) =>
    value === undefined || value === null || value === '' ? '-' : value;

  return (
    <div className="home-shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <h1 className="brand">OpticHome</h1>
          <p className="brand-note">Optician Management</p>
        </div>

        <nav className="sidebar-nav" aria-label="Main">
          {pages.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-item-inner">
                <SidebarIcon type={item.icon} />
                <span>{item.id}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <label className="language-wrap" htmlFor="language-selector">
            <div className="language-control">
              <svg
                className="language-globe"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="8" />
                <path d="M4 12h16M12 4a13 13 0 0 1 0 16M12 4a13 13 0 0 0 0 16" />
              </svg>
              <select
                id="language-selector"
                className="language-select"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option>Arabic</option>
                <option>French</option>
                <option>English</option>
              </select>
              <svg
                className="language-chevron"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.5 7.5L10 12l4.5-4.5" />
              </svg>
            </div>
          </label>

          <button type="button" className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>

      <section className="content-shell">
        <header className="topbar">
          <h2 className="page-title">{pageTitle}</h2>
          <p className="topbar-meta">{formattedDate}</p>
        </header>

        <main className="content-area">
          {activePage === 'Dashboard Page' && (
            <section className="dashboard">
              <div className="analytics-grid">
                {analytics.map((card) => (
                  <article className="stat-card" key={card.label}>
                    <p className="stat-label">{card.label}</p>
                    <p className="stat-value">{card.value}</p>
                  </article>
                ))}
              </div>

              <section className="sales-section">
                <div className="sales-header">
                  <h3 className="section-title">Sales</h3>
                  <div className="sales-actions">
                    <button
                      type="button"
                      className="sell-btn"
                      onClick={openSaleModal}
                    >
                      Sell Glasses
                    </button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table className="sales-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>glassesID</th>
                        <th>clientName</th>
                        <th>originalPrice</th>
                        <th>paidAmount</th>
                        <th>deliveryDate</th>
                        <th>createdAt</th>
                        <th>state</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesData.map((row) => (
                        <tr key={row.id} onClick={() => openSaleDetailsModal(row)}>
                          <td>{displayCell(row.id)}</td>
                          <td>{displayCell(row.glassesID)}</td>
                          <td>{displayCell(clientNameById[row.clientID])}</td>
                          <td>{displayCell(row.originalPrice)}</td>
                          <td>{displayCell(row.paidAmount)}</td>
                          <td>{displayCell(row.deliveryDate)}</td>
                          <td>{displayCell(row.createdAt)}</td>
                          <td>
                            {displayCell(row.state) === '-' ? (
                              '-'
                            ) : (
                              <span className={`state-pill ${row.state.toLowerCase()}`}>
                                {row.state}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </section>
          )}

          {activePage === 'Glasses Page' && (
            <GlassesPage />
          )}

          {activePage === 'Clients Page' && (
            <ClientsPage />
          )}
        </main>
      </section>

      {isSaleModalOpen && (
        <div className="modal-overlay" role="presentation" onClick={closeSaleModal}>
          <section
            className="sale-modal"
            role="dialog"
            aria-modal="true"
            aria-label={saleModalStep === 1 ? 'Select Client' : 'Sale Details'}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-head">
              <h3>{saleModalStep === 1 ? 'Select Client' : 'Sale Details'}</h3>
              <button
                type="button"
                className="close-btn"
                onClick={closeSaleModal}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {saleModalStep === 1 && (
              <div className="modal-step">
                <div className="client-toolbar">
                  <button
                    type="button"
                    className="new-client-btn"
                    onClick={openInlineClientModal}
                  >
                    New Client
                  </button>
                  <input
                    type="text"
                    className="client-search"
                    placeholder="Search client"
                    value={clientSearch}
                    onChange={(event) => setClientSearch(event.target.value)}
                  />
                </div>

                <div className="client-list-wrap">
                  <table className="client-table">
                    <thead>
                      <tr>
                        <th>clientID</th>
                        <th>fullName</th>
                        <th>phone</th>
                        <th>lastVisit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                          <tr
                            key={client.clientID}
                            className={
                              selectedClient?.clientID === client.clientID
                                ? 'selected'
                                : ''
                            }
                            onClick={() => setSelectedClient(client)}
                          >
                            <td>{client.clientID}</td>
                            <td>{client.fullName}</td>
                            <td>{client.phone}</td>
                            <td>{client.lastVisit}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4}>No client matches your search.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="modal-actions end">
                  <button
                    type="button"
                    className="dark-btn"
                    onClick={() => setSaleModalStep(2)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {saleModalStep === 2 && (
              <div className="modal-step">
                <div className="selected-client-text">
                  <p className="selected-client-value">
                    Selected Client :{' '}
                    {selectedClient ? selectedClient.fullName : 'Guest client'}
                  </p>
                </div>

                <div className="form-grid">
                  <label className="field">
                    <span>Frames Type</span>
                    <div className="glasses-dropdown">
                      <button
                        type="button"
                        className="glasses-dropdown-trigger"
                        onClick={() =>
                          setIsGlassesDropdownOpen((prev) => !prev)
                        }
                      >
                        <span>
                          {selectedGlassesModel
                            ? `${selectedGlassesModel.name} (£${selectedGlassesModel.price})`
                            : 'Select frames type'}
                        </span>
                        <span className="dropdown-caret">▾</span>
                      </button>

                      {isGlassesDropdownOpen && (
                        <div className="glasses-dropdown-menu">
                          <input
                            type="text"
                            className="glasses-dropdown-search"
                            placeholder="Search glasses"
                            value={glassesSearch}
                            onChange={(event) =>
                              setGlassesSearch(event.target.value)
                            }
                          />
                          <div className="glasses-dropdown-list">
                            {filteredGlassesModels.length > 0 ? (
                              filteredGlassesModels.map((model) => (
                                <button
                                  key={model.name}
                                  type="button"
                                  className={`glasses-dropdown-item ${
                                    saleForm.glassesModel === model.name
                                      ? 'selected'
                                      : ''
                                  }`}
                                  onClick={() => {
                                    setSaleForm((prev) => ({
                                      ...prev,
                                      glassesModel: model.name,
                                      glassPrice: String(model.price),
                                    }));
                                    setGlassesSearch('');
                                    setIsGlassesDropdownOpen(false);
                                  }}
                                >
                                  {`${model.name} (£${model.price})`}
                                </button>
                              ))
                            ) : (
                              <p className="glasses-dropdown-empty">
                                No glasses found.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="field">
                    <span>Glass Price</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0.00"
                      value={saleForm.glassPrice}
                      onChange={(event) =>
                        setSaleForm((prev) => ({
                          ...prev,
                          glassPrice: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Notes</span>
                    <input
                      type="text"
                      placeholder="Add note"
                      value={saleForm.notes}
                      onChange={(event) =>
                        setSaleForm((prev) => ({
                          ...prev,
                          notes: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Client Paid Amount</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0.00"
                      value={saleForm.clientPaidAmount}
                      onChange={(event) =>
                        setSaleForm((prev) => ({
                          ...prev,
                          clientPaidAmount: event.target.value,
                        }))
                      }
                    />
                  </label>

                  <label className="field">
                    <span>Delivery Date</span>
                    <input
                      type="date"
                      value={saleForm.deliveryDate}
                      onChange={(event) =>
                        setSaleForm((prev) => ({
                          ...prev,
                          deliveryDate: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="modal-actions between">
                  <button
                    type="button"
                    className="scan-btn"
                    onClick={() => setSaleModalStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="dark-btn"
                    onClick={handleSaleSave}
                  >
                    Save Sale
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {isInlineClientModalOpen && (
        <div className="sub-modal-overlay" role="presentation" onClick={closeInlineClientModal}>
          <section
            className="sub-client-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Add New Client"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="sub-client-modal-head">
              <h3>Add New Client</h3>
              <button
                type="button"
                className="close-btn"
                onClick={closeInlineClientModal}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            <form className="sub-client-form" onSubmit={saveInlineClient}>
              <label className="field">
                <span>Name</span>
                <input
                  type="text"
                  value={inlineClientFormData.name}
                  onChange={(event) =>
                    setInlineClientFormData((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
                {inlineClientFormErrors.name && (
                  <small className="field-error">{inlineClientFormErrors.name}</small>
                )}
              </label>

              <div className="form-grid">
                <label className="field">
                  <span>DOB</span>
                  <input
                    type="date"
                    value={inlineClientFormData.dob}
                    onChange={(event) =>
                      setInlineClientFormData((prev) => ({
                        ...prev,
                        dob: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="field">
                  <span>Phone</span>
                  <input
                    type="text"
                    value={inlineClientFormData.phone}
                    onChange={(event) =>
                      setInlineClientFormData((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                  />
                  {inlineClientFormErrors.phone && (
                    <small className="field-error">{inlineClientFormErrors.phone}</small>
                  )}
                </label>
              </div>

              <label className="field">
                <span>Notes</span>
                <input
                  type="text"
                  value={inlineClientFormData.notes}
                  onChange={(event) =>
                    setInlineClientFormData((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                />
              </label>

              <div className="modal-actions end">
                <button type="button" className="scan-btn" onClick={closeInlineClientModal}>
                  Cancel
                </button>
                <button type="submit" className="dark-btn">
                  Save Client
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {isSaleDetailsModalOpen && (
        <div className="modal-overlay" role="presentation" onClick={closeSaleDetailsModal}>
          <section
            className="sale-modal sale-details-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Sale Details"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-head">
              <h3>Sale Details</h3>
              <button
                type="button"
                className="close-btn"
                onClick={closeSaleDetailsModal}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="sale-details-grid">
              <label className="field">
                <span>ID</span>
                <input type="text" value={saleDetailsForm.id} disabled />
              </label>

              <label className="field">
                <span>Client</span>
                <select
                  value={saleDetailsForm.clientID}
                  onChange={(event) =>
                    handleSaleDetailsChange('clientID', event.target.value)
                  }
                >
                  <option value="">-</option>
                  {clients.map((client) => (
                    <option key={client.clientID} value={client.clientID}>
                      {client.fullName}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>State</span>
                <select
                  value={saleDetailsForm.state}
                  onChange={(event) =>
                    handleSaleDetailsChange('state', event.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Ready">Ready</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>

              <label className="field">
                <span>Frames Type</span>
                <div className="glasses-dropdown">
                  <button
                    type="button"
                    className="glasses-dropdown-trigger"
                    onClick={() =>
                      setIsSaleDetailsGlassesOpen((prev) => !prev)
                    }
                  >
                    <span>
                      {selectedSaleDetailsGlassesModel
                        ? `${selectedSaleDetailsGlassesModel.name} (£${selectedSaleDetailsGlassesModel.price})`
                        : displayCell(saleDetailsForm.glassesID)}
                    </span>
                    <span className="dropdown-caret">▾</span>
                  </button>

                  {isSaleDetailsGlassesOpen && (
                    <div className="glasses-dropdown-menu">
                      <input
                        type="text"
                        className="glasses-dropdown-search"
                        placeholder="Search glasses"
                        value={saleDetailsGlassesSearch}
                        onChange={(event) =>
                          setSaleDetailsGlassesSearch(event.target.value)
                        }
                      />
                      <div className="glasses-dropdown-list">
                        {filteredSaleDetailsGlassesModels.length > 0 ? (
                          filteredSaleDetailsGlassesModels.map((model) => (
                            <button
                              key={model.name}
                              type="button"
                              className={`glasses-dropdown-item ${
                                saleDetailsForm.glassesID === model.id
                                  ? 'selected'
                                  : ''
                              }`}
                              onClick={() => {
                                handleSaleDetailsChange('glassesID', model.id);
                                setSaleDetailsGlassesSearch('');
                                setIsSaleDetailsGlassesOpen(false);
                              }}
                            >
                              {`${model.name} (£${model.price})`}
                            </button>
                          ))
                        ) : (
                          <p className="glasses-dropdown-empty">No glasses found.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </label>

              <label className="field">
                <span>Glass Price</span>
                <input
                  type="text"
                  value={saleDetailsForm.originalPrice}
                  onChange={(event) =>
                    handleSaleDetailsChange('originalPrice', event.target.value)
                  }
                />
              </label>

              <label className="field">
                <span>Notes</span>
                <input
                  type="text"
                  value={saleDetailsForm.notes}
                  onChange={(event) =>
                    handleSaleDetailsChange('notes', event.target.value)
                  }
                />
              </label>

              <label className="field">
                <span>Paid Amount</span>
                <input
                  type="text"
                  value={saleDetailsForm.paidAmount}
                  onChange={(event) =>
                    handleSaleDetailsChange('paidAmount', event.target.value)
                  }
                />
              </label>

              <label className="field">
                <span>Delivery Date</span>
                <input
                  type="date"
                  value={saleDetailsForm.deliveryDate}
                  onChange={(event) =>
                    handleSaleDetailsChange('deliveryDate', event.target.value)
                  }
                />
              </label>

              <label className="field">
                <span>Created At</span>
                <input type="text" value={saleDetailsForm.createdAt} disabled />
              </label>
            </div>

            <div className="modal-actions between">
              <button type="button" className="sale-delete-btn" onClick={handleSaleDelete}>
                Delete Sale
              </button>
              <div className="sale-detail-end-actions">
                <button type="button" className="scan-btn" onClick={closeSaleDetailsModal}>
                  Cancel
                </button>
                <button type="button" className="dark-btn" onClick={handleSaleDetailsSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default HomePage;
