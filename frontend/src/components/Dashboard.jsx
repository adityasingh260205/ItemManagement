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

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items');
      setItems(res.data);
    } catch (err) { console.error("Error fetching items", err); }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/items/search?name=${search}`);
      setItems(res.data);
    } catch (err) { console.error("Search failed", err); }
  };

  useEffect(() => {
    if (!token) { navigate('/'); } else { fetchItems(); }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/items/${editingId}`, newItem, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setEditingId(null); 
      } else {
        await axios.post('http://localhost:5000/api/items', newItem, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
      }
      fetchItems();
      setNewItem({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' });
    } catch (err) { alert(err.response?.data?.msg || "Session expired. Please login again."); }
  };

  const triggerEdit = (item) => {
    setEditingId(item._id);
    setNewItem({ itemName: item.itemName, description: item.description, type: item.type, location: item.location, contactInfo: item.contactInfo });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchItems();
    } catch (err) { alert("Unauthorized to delete this item."); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <div className="py-2" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', margin: '-1.5rem', padding: '2rem 1.5rem', width: 'calc(100% + 3rem)' }}>
      <div className="container">
        
        {/* HEADER SECTION */}
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom">
          <div className="d-flex align-items-center">
            <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center shadow-sm me-3" style={{ width: '45px', height: '45px' }}>🔍</div>
            <div>
              <h3 className="fw-bolder mb-0 text-dark" style={{ letterSpacing: '-0.5px' }}>Nexus Finder</h3>
              <small className="text-secondary fw-medium">Campus Lost & Found Hub</small>
            </div>
          </div>
          <button className="btn btn-outline-danger rounded-pill px-4 fw-bold shadow-sm" onClick={handleLogout}>Log Out</button>
        </div>

        {/* SEARCH & FILTER */}
        <div className="row mb-5 justify-content-center">
          <div className="col-lg-8">
            <div className="input-group shadow-sm" style={{ borderRadius: '2rem', overflow: 'hidden' }}>
              <span className="input-group-text bg-white border-0 ps-4 text-muted">🔎</span>
              <input type="text" className="form-control border-0 bg-white py-3 shadow-none" placeholder="Search for items..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="btn btn-primary px-4 fw-bold" onClick={handleSearch}>Search</button>
              <button className="btn btn-light px-4 fw-bold border-start" onClick={() => { setSearch(''); fetchItems(); }}>Clear</button>
            </div>
          </div>
        </div>

        {/* REPORT FORM */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className={`card border-0 shadow-sm ${editingId ? 'bg-light' : 'bg-white'}`} style={{ borderRadius: '1rem' }}>
              <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-center mb-4">
                  <span className="fs-4 me-2">{editingId ? '✏️' : '📝'}</span>
                  <h5 className="fw-bold mb-0 text-dark">{editingId ? "Update Item Record" : "File a New Report"}</h5>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small text-muted fw-bold">ITEM NAME</label>
                      <input className="form-control bg-light border-0 py-2" style={{ borderRadius: '0.75rem' }} placeholder="e.g. MacBook Pro" value={newItem.itemName} onChange={e => setNewItem({...newItem, itemName: e.target.value})} required />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label small text-muted fw-bold">DESCRIPTION</label>
                      <input className="form-control bg-light border-0 py-2" style={{ borderRadius: '0.75rem' }} placeholder="Silver, stickers on back" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} required />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small text-muted fw-bold">STATUS</label>
                      <select className="form-select bg-light border-0 py-2" style={{ borderRadius: '0.75rem' }} value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})}>
                        <option value="Lost">Lost</option>
                        <option value="Found">Found</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">LOCATION</label>
                      <input className="form-control bg-light border-0 py-2" style={{ borderRadius: '0.75rem' }} placeholder="Library 2nd Floor" value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-muted fw-bold">CONTACT INFO</label>
                      <input className="form-control bg-light border-0 py-2" style={{ borderRadius: '0.75rem' }} placeholder="student@email.com" value={newItem.contactInfo} onChange={e => setNewItem({...newItem, contactInfo: e.target.value})} required />
                    </div>
                    
                    <div className="col-12 mt-4 d-flex justify-content-end gap-2">
                      {editingId && (
                        <button type="button" className="btn btn-light px-4 rounded-pill fw-bold" onClick={() => { setEditingId(null); setNewItem({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' }); }}>
                          Cancel
                        </button>
                      )}
                      <button className={`btn px-5 rounded-pill fw-bold shadow-sm ${editingId ? 'btn-warning' : 'btn-dark'}`}>
                        {editingId ? "Save Changes" : "Submit Report"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* ITEMS FEED */}
        <h5 className="fw-bolder mb-4 text-dark">Recent Reports</h5>
        <div className="row g-4">
          {items.length > 0 ? items.map(i => (
            <div key={i._id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '1rem', borderTop: `4px solid ${i.type === 'Lost' ? '#dc3545' : '#198754'}` }}>
                <div className="card-body p-4 position-relative">
                  <span className={`badge rounded-pill position-absolute top-0 end-0 m-4 px-3 py-2 bg-${i.type === 'Lost' ? 'danger' : 'success'} bg-opacity-10 text-${i.type === 'Lost' ? 'danger' : 'success'}`}>
                    {i.type === 'Lost' ? '🔴 Lost' : '🟢 Found'}
                  </span>
                  
                  <h5 className="fw-bolder text-dark mb-2 mt-2 pe-5">{i.itemName}</h5>
                  <p className="text-secondary small mb-4 lh-lg">{i.description}</p>
                  
                  <div className="d-flex flex-column gap-2 mb-4">
                    <div className="d-flex align-items-center text-muted small">
                      <span className="me-2">📍</span> {i.location}
                    </div>
                    <div className="d-flex align-items-center text-muted small">
                      <span className="me-2">✉️</span> {i.contactInfo}
                    </div>
                  </div>
                </div>
                
                <div className="card-footer bg-transparent border-top-0 px-4 pb-4 pt-0 d-flex gap-2">
                  <button className="btn btn-light btn-sm flex-grow-1 rounded-pill fw-bold text-primary" onClick={() => triggerEdit(i)}>Edit</button>
                  <button className="btn btn-light btn-sm flex-grow-1 rounded-pill fw-bold text-danger" onClick={() => deleteItem(i._id)}>Resolve</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-12 py-5 text-center">
              <div className="text-muted fs-1 mb-3">📭</div>
              <h4 className="text-muted fw-light">The feed is empty.</h4>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}