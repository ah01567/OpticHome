import { useMemo, useState } from 'react';
import './GlassesPage.css';

const initialFrames = [
  {
    id: 'FRM-1001',
    image: '',
    name: 'Classic Black Round',
    dimensions: '50-18-140',
    price: 120,
    quantity: 8,
    createdAt: '2026-03-30',
    updatedAt: '2026-03-30',
  },
  {
    id: 'FRM-1002',
    image: '',
    name: 'Matte Silver Square',
    dimensions: '52-19-142',
    price: 145,
    quantity: 3,
    createdAt: '2026-03-28',
    updatedAt: '2026-03-30',
  },
  {
    id: 'FRM-1003',
    image: '',
    name: 'Tortoise Soft Oval',
    dimensions: '49-17-138',
    price: 132,
    quantity: 12,
    createdAt: '2026-03-25',
    updatedAt: '2026-03-29',
  },
  {
    id: 'FRM-1004',
    image: '',
    name: 'Champagne Thin Rim',
    dimensions: '51-20-145',
    price: 165,
    quantity: 2,
    createdAt: '2026-03-22',
    updatedAt: '2026-03-30',
  },
];

const emptyForm = {
  image: null,
  name: '',
  dimensions: '',
  price: '',
  quantity: '',
};

function GlassesPage() {
  const [isAddFrameModalOpen, setIsAddFrameModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingFrameId, setEditingFrameId] = useState(null);
  const [frames, setFrames] = useState(initialFrames);
  const [frameSearch, setFrameSearch] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
      }),
    []
  );

  const dateString = () => new Date().toISOString().slice(0, 10);
  const filteredFrames = frames.filter((frame) => {
    const query = frameSearch.trim().toLowerCase();
    if (!query) return true;

    return (
      frame.id.toLowerCase().includes(query) ||
      frame.name.toLowerCase().includes(query) ||
      frame.dimensions.toLowerCase().includes(query)
    );
  });
  const displayCell = (value) =>
    value === undefined || value === null || value === '' ? '-' : value;

  const openModal = () => {
    setIsAddFrameModalOpen(true);
    setEditingFrameId(null);
    setFormData(emptyForm);
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview('');
    setFormErrors({});
  };

  const openFrameDetailsModal = (frame) => {
    setIsAddFrameModalOpen(true);
    setEditingFrameId(frame.id);
    setFormData({
      image: null,
      name: frame.name || '',
      dimensions: frame.dimensions || '',
      price: frame.price ?? '',
      quantity: frame.quantity ?? '',
    });
    setImagePreview(frame.image || '');
    setFormErrors({});
  };

  const closeModal = () => {
    setIsAddFrameModalOpen(false);
    setIsDeleteConfirmOpen(false);
    setEditingFrameId(null);
    setFormData(emptyForm);
    setFormErrors({});
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview('');
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    if (!file) {
      setFormData((prev) => ({ ...prev, image: null }));
      setImagePreview('');
      return;
    }

    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(preview);
    setFormErrors((prev) => ({ ...prev, image: '' }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required.';

    const priceValue = Number(formData.price);
    if (formData.price === '' || Number.isNaN(priceValue) || priceValue < 0) {
      errors.price = 'Enter a valid price.';
    }

    const quantityValue = Number(formData.quantity);
    if (
      formData.quantity === '' ||
      Number.isNaN(quantityValue) ||
      !Number.isInteger(quantityValue) ||
      quantityValue < 0
    ) {
      errors.quantity = 'Enter a valid quantity.';
    }

    return errors;
  };

  const handleSaveFrame = (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const now = dateString();
    const generatedId = `FRM-${Date.now().toString().slice(-6)}`;

    if (editingFrameId) {
      setFrames((prev) =>
        prev.map((frame) =>
          frame.id === editingFrameId
            ? {
                ...frame,
                image: imagePreview || frame.image || '',
                name: formData.name.trim(),
                dimensions: formData.dimensions.trim(),
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                updatedAt: now,
              }
            : frame
        )
      );
    } else {
      const newFrame = {
        id: generatedId,
        image: imagePreview || '',
        name: formData.name.trim(),
        dimensions: formData.dimensions.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        createdAt: now,
        updatedAt: now,
      };

      setFrames((prev) => [newFrame, ...prev]);
    }
    closeModal();
  };

  const openDeleteConfirm = () => {
    if (!editingFrameId) return;
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteFrame = () => {
    if (!editingFrameId) return;
    setFrames((prev) => prev.filter((frame) => frame.id !== editingFrameId));
    setIsDeleteConfirmOpen(false);
    closeModal();
  };

  return (
    <section className="glasses-page">
      <header className="glasses-header">
        <h3 className="section-title title-with-icon">
          <svg className="page-title-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="7.5" cy="13" r="3.7" />
            <circle cx="16.5" cy="13" r="3.7" />
            <path d="M3.8 10.8h3M17.2 10.8h3M11 13h2" />
          </svg>
          <span>Glasses</span>
        </h3>

        <button type="button" className="add-frame-btn" onClick={openModal}>
          Add New Frames
        </button>
      </header>

      <div className="glasses-toolbar">
        <input
          type="text"
          className="glasses-search"
          placeholder="Search by ID, name, or dimensions"
          value={frameSearch}
          onChange={(event) => setFrameSearch(event.target.value)}
        />
      </div>

      <section className="frames-table-shell">
        <table className="frames-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Dimensions</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredFrames.length > 0 ? (
              filteredFrames.map((frame) => (
                <tr key={frame.id} onClick={() => openFrameDetailsModal(frame)}>
                  <td>{displayCell(frame.id)}</td>
                  <td>{displayCell(frame.name)}</td>
                  <td>{displayCell(frame.dimensions)}</td>
                  <td>
                    {frame.price === undefined || frame.price === null || frame.price === ''
                      ? '-'
                      : currencyFormatter.format(frame.price)}
                  </td>
                  <td>{displayCell(frame.quantity)}</td>
                  <td>{displayCell(frame.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6}>No frame types found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {isAddFrameModalOpen && (
        <div className="modal-overlay" role="presentation" onClick={closeModal}>
          <section
            className="frame-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Add New Frame"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="modal-header">
              <div className="modal-title-wrap">
                <h2>{editingFrameId ? 'Frame Details' : 'New frame type'}</h2>
              </div>
              <button
                type="button"
                className="frame-close-btn"
                onClick={closeModal}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            <form className="frame-form" onSubmit={handleSaveFrame}>
              <div className="form-column">
                <label className="field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) => handleInputChange('name', event.target.value)}
                  />
                  {formErrors.name && <small className="field-error">{formErrors.name}</small>}
                </label>

                <label className="field">
                  <span>Dimensions</span>
                  <input
                    type="text"
                    placeholder="e.g. 50-18-140"
                    value={formData.dimensions}
                    onChange={(event) =>
                      handleInputChange('dimensions', event.target.value)
                    }
                  />
                </label>

                <div className="split-fields">
                  <label className="field">
                    <span>Price</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(event) => handleInputChange('price', event.target.value)}
                    />
                    {formErrors.price && (
                      <small className="field-error">{formErrors.price}</small>
                    )}
                  </label>

                  <label className="field">
                    <span>Quantity</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(event) =>
                        handleInputChange('quantity', event.target.value)
                      }
                    />
                    {formErrors.quantity && (
                      <small className="field-error">{formErrors.quantity}</small>
                    )}
                  </label>
                </div>

                <label className="field image-field">
                  <span>Image</span>
                  <div className="upload-row">
                    <label className="upload-btn" htmlFor="frame-image-input">
                      <input
                        id="frame-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <span>Upload Image</span>
                      <svg className="upload-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 16V7" />
                        <path d="M8.5 10.5L12 7l3.5 3.5" />
                        <path d="M5 17.5h14" />
                      </svg>
                    </label>
                    {imagePreview && (
                      <div className="image-preview-frame" aria-label="Selected image preview">
                        <img
                          src={imagePreview}
                          alt="Selected frame"
                          className="image-preview"
                        />
                      </div>
                    )}
                  </div>
                </label>

                <div className="modal-actions">
                  {editingFrameId && (
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
                    {editingFrameId ? 'Update Frame' : 'Save Frame'}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      )}

      {isDeleteConfirmOpen && editingFrameId && (
        <div
          className="confirm-overlay"
          role="presentation"
          onClick={closeDeleteConfirm}
        >
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm frame deletion"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>Delete frame type?</h3>
            <p>This frame type will be removed from the list.</p>
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
                onClick={handleDeleteFrame}
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

export default GlassesPage;
