import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const categoryIcons = {
  'Makeup Artists': '💄', 'Mehndi Artists': '🌿', 'Decorators': '🎀',
  'Caterers': '🍽️', 'Photographers': '📸', 'Videographers': '🎬',
  'DJs': '🎧', 'Singers': '🎤', 'Dancers': '💃', 'Anchors': '🎙️',
  'Wedding Planners': '💍', 'Event Organizers': '📋',
};

const priceRanges = [
  { label: 'Any Budget', value: '' },
  { label: 'Under ₹10,000', value: 'under-10000' },
  { label: '₹10K – ₹25K', value: '10000-25000' },
  { label: '₹25K – ₹50K', value: '25000-50000' },
  { label: '₹50K+', value: '50000+' },
];

const BrowseEvents = () => {
  const navigate = useNavigate();

  const [allArtists, setAllArtists] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  useEffect(() => {
    // Read pre-filled category from URL params
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setActiveCategory(cat);
    
    // Read pre-filled location/search from URL
    const loc = params.get('location');
    if (loc) setSearch(loc);

    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // 1. Load Categories
      const cats = await api.getCategories();
      setCategories(cats);

      // 2. Load Services
      const services = await api.getServices();
      setAllArtists(services);
      setFiltered(services);
    } catch (error) {
      console.error('Error loading browse page data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters client-side for ultra-fast responsive interactions
  useEffect(() => {
    let result = [...allArtists];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        (a.name || '').toLowerCase().includes(q) ||
        (a.category || '').toLowerCase().includes(q) ||
        (a.city || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q)
      );
    }

    if (activeCategory) {
      result = result.filter(a =>
        (a.category || '').toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (verifiedOnly) {
      result = result.filter(a => a.isVerified);
    }

    if (priceFilter) {
      result = result.filter(a => {
        const price = a.price || 0;
        if (priceFilter === 'under-10000') return price < 10000;
        if (priceFilter === '10000-25000') return price >= 10000 && price <= 25000;
        if (priceFilter === '25000-50000') return price >= 25000 && price <= 50000;
        if (priceFilter === '50000+') return price > 50000;
        return true;
      });
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else {
      // Default: Sort by rating (descending)
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [search, activeCategory, verifiedOnly, priceFilter, sortBy, allArtists]);

  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── TOP SEARCH BAR (BookMyShow style) ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        padding: '110px 24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ color: 'white', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 855, marginBottom: '10px', tracking: '-0.025em' }}>
            Book Verified Event Partners
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.98rem', marginBottom: '24px', maxWidth: '600px' }}>
            Connect with top-rated professionals for catering, photography, makeup, decor, and wedding planning.
          </p>

          {/* Search + Filters row */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {/* Search */}
            <div style={{ flex: '1', minWidth: '280px', position: 'relative' }}>
              <i className="fas fa-search" style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                color: '#94a3b8', fontSize: '0.95rem'
              }} />
              <input
                type="text" placeholder="Search artists, services, city locations..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px 14px 44px',
                  background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px', color: 'white', fontSize: '0.95rem',
                  outline: 'none', backdropFilter: 'blur(10px)', boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.background = 'rgba(255,255,255,0.09)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.target.style.background = 'rgba(255,255,255,0.06)';
                }}
              />
            </div>

            {/* Price */}
            <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}
              style={{
                padding: '14px 16px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '0.9rem', cursor: 'pointer',
                outline: 'none', minWidth: '150px'
              }}>
              {priceRanges.map(r => <option key={r.value} value={r.value} style={{ color: '#0f172a' }}>{r.label}</option>)}
            </select>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '14px 16px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '0.9rem', cursor: 'pointer',
                outline: 'none', minWidth: '150px'
              }}>
              <option value="rating" style={{ color: '#0f172a' }}>Highest Rated</option>
              <option value="newest" style={{ color: '#0f172a' }}>Newest Listed</option>
              <option value="price-low" style={{ color: '#0f172a' }}>Price: Low to High</option>
              <option value="price-high" style={{ color: '#0f172a' }}>Price: High to Low</option>
              <option value="name" style={{ color: '#0f172a' }}>Name: A-Z</option>
            </select>

            {/* Verified toggle */}
            <button onClick={() => setVerifiedOnly(v => !v)} style={{
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700,
              border: `1.5px solid ${verifiedOnly ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
              background: verifiedOnly ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)',
              color: verifiedOnly ? '#34d399' : 'white', fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease'
            }}>
              <i className="fas fa-shield-alt"></i> Verified Only
            </button>
          </div>

          {/* Category pills — horizontal scroll like BookMyShow */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
            <button
              onClick={() => setActiveCategory('')}
              style={{
                flexShrink: 0, padding: '10px 22px', borderRadius: '30px', cursor: 'pointer',
                border: '1.5px solid', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s ease',
                borderColor: !activeCategory ? '#6366f1' : 'rgba(255,255,255,0.15)',
                background: !activeCategory ? '#6366f1' : 'rgba(255,255,255,0.04)',
                color: 'white',
              }}
            >All</button>
            {categories.map(cat => (
              <button key={cat._id || cat.name}
                onClick={() => setActiveCategory(activeCategory === cat.name ? '' : cat.name)}
                style={{
                  flexShrink: 0, padding: '10px 22px', borderRadius: '30px', cursor: 'pointer',
                  border: '1.5px solid', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s ease',
                  borderColor: activeCategory === cat.name ? '#6366f1' : 'rgba(255,255,255,0.15)',
                  background: activeCategory === cat.name ? '#6366f1' : 'rgba(255,255,255,0.04)',
                  color: 'white',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <span>{categoryIcons[cat.name] || '🎭'}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RESULTS AREA ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Results count + active filters */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '30px' }}>
          <div>
            <span style={{ color: '#1e293b', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
              {loading ? 'Searching artists...' : `${filtered.length} Artist${filtered.length !== 1 ? 's' : ''} Found`}
            </span>
            {activeCategory && (
              <span style={{
                marginLeft: '12px', background: 'rgba(99,102,241,0.08)', color: '#4f46e5',
                padding: '4px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: '6px'
              }}>
                {categoryIcons[activeCategory] || '🎭'} {activeCategory}
                <button onClick={() => setActiveCategory('')} style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', padding: 0, fontSize: '11px', fontWeight: 'bold' }}>✕</button>
              </span>
            )}
          </div>
          {(search || activeCategory || priceFilter || verifiedOnly) && (
            <button onClick={() => { setSearch(''); setActiveCategory(''); setPriceFilter(''); setVerifiedOnly(false); }}
              style={{
                background: 'none', border: '1px solid #cbd5e1', borderRadius: '8px',
                padding: '8px 16px', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer',
                fontWeight: 600, transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* ── ARTIST CARDS ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{
              width: '48px', height: '48px', border: '4px solid #6366f1',
              borderTopColor: 'transparent', borderRadius: '50%',
              animation: 'spin 1s linear infinite', margin: '0 auto 20px'
            }} />
            <p style={{ color: '#64748b', fontWeight: 600 }}>Curating best profiles...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>🎭</div>
            <h3 style={{ color: '#1e293b', fontWeight: 800, marginBottom: '8px', fontSize: '1.3rem' }}>No Professionals Match Filters</h3>
            <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
              We couldn't find any artists matching your search settings. Try adjusting filters or searching a different term.
            </p>
            <button onClick={() => { setSearch(''); setActiveCategory(''); setPriceFilter(''); setVerifiedOnly(false); }}
              style={{
                background: '#4f46e5', color: 'white', padding: '12px 28px',
                borderRadius: '30px', border: 'none', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(79,70,229,0.3)'
              }}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '24px',
          }}>
            {paged.map(artist => {
              const price = artist.price || 0;
              const image = artist.image || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80`;
              const name = artist.name || 'Unnamed Artist';
              const category = artist.category || 'Event Professional';
              const location = artist.city || 'India';
              const rating = artist.rating || 5.0;
              const reviews = artist.reviewsCount || 0;

              return (
                <div key={artist._id}
                  onClick={() => navigate(`/booking/${artist._id}`)}
                  style={{
                    background: '#ffffff', border: '1px solid #e2e8f0',
                    borderRadius: '20px', overflow: 'hidden', cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(99, 102, 241, 0.15), 0 10px 10px -5px rgba(99, 102, 241, 0.04)';
                    e.currentTarget.style.borderColor = '#6366f1';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  {/* Image wrapper */}
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img src={image} alt={name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.5s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    
                    {/* Verified badge */}
                    {artist.isVerified && (
                      <div style={{
                        position: 'absolute', top: '14px', left: '14px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white', padding: '4px 12px', borderRadius: '30px',
                        fontSize: '0.72rem', fontWeight: 800,
                        display: 'flex', alignItems: 'center', gap: '5px',
                        boxShadow: '0 4px 10px rgba(16,185,129,0.3)'
                      }}>
                        <i className="fas fa-shield-alt"></i> Verified
                      </div>
                    )}
                    
                    {/* Price badge */}
                    <div style={{
                      position: 'absolute', top: '14px', right: '14px',
                      background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
                      color: 'white', padding: '5px 14px', borderRadius: '30px',
                      fontSize: '0.8rem', fontWeight: 800, border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      ₹{price.toLocaleString('en-IN')}
                    </div>
                    
                    {/* Category chip */}
                    <div style={{
                      position: 'absolute', bottom: '14px', left: '14px',
                      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
                      color: '#0f172a', padding: '4px 12px', borderRadius: '30px',
                      fontSize: '0.75rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: '6px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                    }}>
                      <span>{categoryIcons[category] || '🎭'}</span>
                      <span>{category}</span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.08rem', margin: 0, lineHeight: 1.3 }}>
                      {name}
                    </h3>

                    <p style={{
                      color: '#64748b', fontSize: '0.86rem', lineHeight: 1.55, margin: 0,
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      height: '42px'
                    }}>
                      {artist.description || `Professional ${category.toLowerCase()} available for events, weddings and celebrations.`}
                    </p>

                    {/* Location + Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ color: '#64748b', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                        <i className="fas fa-map-marker-alt" style={{ color: '#94a3b8' }}></i> {location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b' }}>
                        <i className="fas fa-star"></i> {parseFloat(rating).toFixed(1)}
                        <span style={{ color: '#94a3b8', fontWeight: 600 }}>({reviews})</span>
                      </span>
                    </div>

                    {/* Book Now trigger */}
                    <button style={{
                      width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white',
                      fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                      marginTop: '8px', transition: 'all 0.2s ease',
                      boxShadow: '0 4px 10px rgba(99,102,241,0.15)'
                    }}>
                      Select Package & Book
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '50px' }}>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              style={{
                padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0',
                background: 'white', color: '#1e293b', cursor: currentPage === 1 ? 'default' : 'pointer',
                opacity: currentPage === 1 ? 0.4 : 1, fontWeight: 700, fontSize: '0.88rem'
              }}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((p, i, arr) => (
                <div key={p} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span style={{ padding: '0 8px', color: '#94a3b8' }}>…</span>
                  )}
                  <button onClick={() => setCurrentPage(p)}
                    style={{
                      width: '42px', height: '42px', borderRadius: '10px',
                      border: `1.5px solid ${currentPage === p ? '#4f46e5' : '#e2e8f0'}`,
                      background: currentPage === p ? '#4f46e5' : 'white',
                      color: currentPage === p ? 'white' : '#1e293b',
                      fontWeight: 800, cursor: 'pointer'
                    }}>{p}</button>
                </div>
              ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              style={{
                padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0',
                background: 'white', color: '#1e293b', cursor: currentPage === totalPages ? 'default' : 'pointer',
                opacity: currentPage === totalPages ? 0.4 : 1, fontWeight: 700, fontSize: '0.88rem'
              }}>Next →</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default BrowseEvents;
