import { useState } from 'react';

const posts = [
  {
    id: 1,
    category: 'Bridal',
    readTime: '5 min read',
    title: 'How to Choose the Perfect Bridal Makeup Artist',
    excerpt: 'Your wedding-day look lives in photographs forever. Here\'s exactly what to ask before you book — from style portfolios to trial sessions.',
    date: 'June 15, 2026',
    author: 'Priya Sharma',
    authorRole: 'Beauty Editor',
    image: '/blog_makeup.jpg',
    featured: true,
  },
  {
    id: 2,
    category: 'Photography',
    readTime: '7 min read',
    title: 'Complete Guide to Hiring a Wedding Photographer in India',
    excerpt: 'Candid or traditional? Pre-wedding shoot or not? We break down every decision so you never regret your photos.',
    date: 'June 10, 2026',
    author: 'Rahul Verma',
    authorRole: 'Photographer, 8 yrs',
    image: '/blog_photography.jpg',
    featured: false,
  },
  {
    id: 3,
    category: 'Decor',
    readTime: '6 min read',
    title: 'Top Wedding Decoration Trends Ruling 2026',
    excerpt: 'Floral walls are out. Dried pampas, neon signs, and sustainable mandap setups are in. Here\'s what top decorators are doing.',
    date: 'May 28, 2026',
    author: 'Anjali Patel',
    authorRole: 'Event Stylist',
    image: '/blog_decor.jpg',
    featured: false,
  },
  {
    id: 4,
    category: 'Entertainment',
    readTime: '4 min read',
    title: 'How to Book the Right DJ for Your Wedding Reception',
    excerpt: 'Not all DJs read the room the same way. Here\'s a playlist-first checklist to find one who will make your dance floor unforgettable.',
    date: 'May 20, 2026',
    author: 'Vikram Singh',
    authorRole: 'DJ & Music Producer',
    image: '/blog_dj.jpg',
    featured: false,
  },
  {
    id: 5,
    category: 'Mehndi',
    readTime: '3 min read',
    title: 'What to Check Before Booking Your Mehndi Artist',
    excerpt: 'Hygiene, henna quality, design portfolio — 7 things every bride should confirm before the mehndi ceremony.',
    date: 'May 15, 2026',
    author: 'Deepika Rao',
    authorRole: 'Mehndi Artist, 6 yrs',
    image: '/blog_mehndi.jpg',
    featured: false,
  },
];

const categoryColors = {
  Bridal: '#ec4899',
  Photography: '#3b82f6',
  Decor: '#f59e0b',
  Entertainment: '#8b5cf6',
  Mehndi: '#ef4444',
  Guide: '#10b981',
};

const Blog = () => {
  const [active, setActive] = useState('All');
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];
  const featured = posts.find(p => p.featured);
  const rest = posts.filter(p => !p.featured && (active === 'All' || p.category === active));

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── TOP NAV-STYLE HEADER ── */}
      <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '2px', marginBottom: '6px' }}>THE TALENTCONNECT BLOG</p>
        <h1 style={{ color: 'var(--text)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800 }}>Stories, Tips & Inspiration</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '1rem' }}>Real advice from real event professionals across India.</p>
      </div>

      {/* ── FEATURED POST ── */}
      {featured && (
        <div style={{ maxWidth: '1100px', margin: '48px auto 0', padding: '0 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)',
            background: 'var(--card-bg)'
          }}>
            <img src={featured.image} alt={featured.title}
              style={{ width: '100%', height: '360px', objectFit: 'cover' }} />
            <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '18px' }}>
                <span style={{
                  background: '#ec4899', color: 'white',
                  padding: '4px 14px', borderRadius: '30px', fontSize: '0.78rem', fontWeight: 700
                }}>⭐ Featured</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{featured.readTime}</span>
              </div>
              <h2 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.6rem', lineHeight: 1.35, marginBottom: '14px' }}>
                {featured.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.97rem', marginBottom: '28px' }}>
                {featured.excerpt}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), #ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: '1rem'
                }}>{featured.author[0]}</div>
                <div>
                  <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.9rem' }}>{featured.author}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{featured.authorRole} · {featured.date}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CATEGORY PILLS ── */}
      <div style={{ maxWidth: '1100px', margin: '48px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {categories.map(c => (
            <button key={c} onClick={() => setActive(c)} style={{
              padding: '8px 22px', borderRadius: '30px',
              background: active === c ? 'var(--primary)' : 'var(--card-bg)',
              color: active === c ? 'white' : 'var(--text-muted)',
              border: `1.5px solid ${active === c ? 'var(--primary)' : 'var(--border)'}`,
              fontWeight: 600, fontSize: '0.87rem', cursor: 'pointer', transition: '0.2s'
            }}>{c}</button>
          ))}
        </div>

        {/* ── ARTICLE GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '24px', paddingBottom: '80px' }}>
          {rest.map(post => (
            <article key={post.id} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: '20px', overflow: 'hidden',
              transition: '0.25s', cursor: 'pointer',
            }}>
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img src={post.image} alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s' }} />
                <span style={{
                  position: 'absolute', top: '14px', left: '14px',
                  background: categoryColors[post.category] || 'var(--primary)',
                  color: 'white', padding: '4px 12px', borderRadius: '20px',
                  fontSize: '0.75rem', fontWeight: 700
                }}>{post.category}</span>
              </div>
              <div style={{ padding: '22px' }}>
                <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.45, marginBottom: '10px' }}>
                  {post.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '18px' }}>
                  {post.excerpt}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: `linear-gradient(135deg, ${categoryColors[post.category] || 'var(--primary)'}, #6366f1)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 800, fontSize: '0.8rem'
                    }}>{post.author[0]}</div>
                    <div>
                      <div style={{ color: 'var(--text)', fontSize: '0.8rem', fontWeight: 600 }}>{post.author}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{post.date}</div>
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
