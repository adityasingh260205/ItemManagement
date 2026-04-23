import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null); 
  const [newItem, setNewItem] = useState({ 
    itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' 
  });
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // --- REPLACE WITH YOUR ACTUAL BACKEND URL ---
  const BASE_URL = 'https://itemmanagement-backend-edn3.onrender.com';

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/items`);
      setItems(res.data);
    } catch (err) { 
      console.error("Error fetching items", err); 
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/items/search?name=${search}`);
      setItems(res.data);
    } catch (err) { 
      console.error("Search failed", err); 
    }
  };

  useEffect(() => {
    if (!token) { 
      navigate('/'); 
    } else { 
      fetchItems(); 
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // PUT request for updating
        await axios.put(`${BASE_URL}/api/items/${editingId}`, newItem, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setEditingId(null); 
      } else {
        // POST request for adding
        await axios.post(`${BASE_URL}/api/items`, newItem, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
      }
      fetchItems(); // Refresh the list
      setNewItem({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' });
    } catch (err) { 
      alert(err.response?.data?.msg || "Session expired or database error. Please login again."); 
    }
  };

  const triggerEdit = (item) => {
    setEditingId(item._id);
    setNewItem({ 
      itemName: item.itemName, 
      description: item.description, 
      type: item.type, 
      location: item.location, 
      contactInfo: item.contactInfo 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure you want to remove this report?")) {
      try {
        await axios.delete(`${BASE_URL}/api/items/${id}`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        fetchItems();
      } catch (err) { 
        alert("Unauthorized or error deleting item."); 
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <div className="py-2" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', margin: '-1.5rem', padding: '2rem 1.5rem', width: 'calc(100% + 3rem)' }}>
      <div className="container">
        
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom bg-white p-3 rounded-4 shadow-sm">
          <div className="d-flex align-items-center">
            <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm me-3" style={{ width: '45px', height: '45px' }}>🔍</div>
            <div>
              <h3 className="fw-bolder mb-0 text-dark">Campus Finder</h3>
              <small className="text-secondary fw-medium">Lost & Found Portal</small>
            </div>
          </div>
          <button className="btn btn-outline-danger rounded-pill px-4 fw-bold shadow-sm" onClick={handleLogout}>Log Out</button>
        </div>

        {/* SEARCH SECTION */}
        <div className="row mb-5 justify-content-center">
          <div className="col-lg-8">
            <div className="input-group shadow-sm border-0" style={{ borderRadius: '2rem', overflow: 'hidden' }}>
              <input type="text" className="form-control border-0 bg-white py-3 ps-4 shadow-none" placeholder="Search by item name..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="btn btn-primary px-4 fw-bold" onClick={handleSearch}>Search</button>
              <button className="btn btn-light px-4 fw-bold border-start" onClick={() => { setSearch(''); fetchItems(); }}>Clear</button>
            </div>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className={`card border-0 shadow-sm ${editingId ? 'bg-light border border-warning' : 'bg-white'}`} style={{ borderRadius: '1rem' }}>
              <div className="card-body p-4 p-md-5">
                <h5 className="fw-bold mb-4 text-dark">{editingId ? "✏️ Update Record" : "📝 File New Report"}</h5>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small text-muted fw-bold">ITEM NAME</label>
                      <input className="form-control bg-light border-0 py-2" value={newItem.itemName} onChange={e => setNewItem({...newItem, itemName: e.target.value})} required />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label small text-muted fw-bold">DESCRIPTION</label>
                      <input className="form-control bg-light border-0 py-2" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} required />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small text-muted fw-bold">STATUS</label>
                      <select className="form-select bg-light border-0 py-2" value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})}>
                        <option value="Lost">Lost</option>
                        <option value="Found">Found</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">LOCATION</label>
                      <input className="form-control bg-light border-0 py-2" value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">CONTACT INFO</label>
                      <input className="form-control bg-light border-0 py-2" value={newItem.contactInfo} onChange={e => setNewItem({...newItem, contactInfo: e.target.value})} required />
                    </div>
                    <div className="col-12 mt-4 d-flex justify-content-end gap-2">
                      {editingId && (
                        <button type="button" className="btn btn-light px-4 rounded-pill fw-bold" onClick={() => { setEditingId(null); setNewItem({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' }); }}>Cancel</button>
                      )}
                      <button type="submit" className={`btn px-5 rounded-pill fw-bold shadow-sm ${editingId ? 'btn-warning' : 'btn-dark'}`}>
                        {editingId ? "Save Changes" : "Submit Report"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* FEED SECTION */}
        <h5 className="fw-bolder mb-4 text-dark pe-2">Recent Reports</h5>
        <div className="row g-4">
          {items.length > 0 ? items.map(i => (
            <div key={i._id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '1rem', borderTop: `5px solid ${i.type === 'Lost' ? '#dc3545' : '#198754'}` }}>
                <div className="card-body p-4">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="fw-bolder text-dark mb-0">{i.itemName}</h5>
                      <span className={`badge rounded-pill bg-${i.type === 'Lost' ? 'danger' : 'success'} bg-opacity-10 text-${i.type === 'Lost' ? 'danger' : 'success'}`}>
                        {i.type}
                      </span>
                   </div>
                  <p className="text-secondary small mb-4">{i.description}</p>
                  <div className="bg-light p-3 rounded-3 mb-2">
                    <p className="mb-1 small"><strong>📍 Location:</strong> {i.location}</p>
                    <p className="mb-0 small"><strong>✉️ Contact:</strong> {i.contactInfo}</p>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0 px-4 pb-4 pt-0 d-flex gap-2">
                  <button className="btn btn-light btn-sm flex-grow-1 rounded-pill fw-bold text-primary" onClick={() => triggerEdit(i)}>Edit</button>
                  <button className="btn btn-light btn-sm flex-grow-1 rounded-pill fw-bold text-danger" onClick={() => deleteItem(i._id)}>Resolve</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-12 py-5 text-center">
              <h4 className="text-muted fw-light">No items found matching your criteria.</h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}