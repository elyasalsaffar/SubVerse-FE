import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Client from "../services/api"
import { Link } from "react-router-dom"

const HomePage = ({ user }) => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [sort, setSort] = useState('latest')
    const [voteBusy, setVoteBusy] = useState({})
    const [flash, setFlash] = useState('')

    const location = useLocation()
    const navigate = useNavigate()

    // needs review
      // pick up flash from navigation state
  useEffect(() => {
    if (location.state?.flash) {
      setFlash(location.state.flash)
      // clear it from history so it doesn’t persist on refresh/back
      navigate(location.pathname, { replace: true, state: {} })
      // auto-hide after 3s (optional)
      const t = setTimeout(() => setFlash(''), 3000)
      return () => clearTimeout(t)
    }
  }, [location.state, location.pathname, navigate]) 

    const load = async () => {
        setLoading(true)
        try {
            const res = await Client.get('/posts', { params: { sort } })
            setPosts(res.data || [])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [sort])

    const vote = async (postId, type) => {
        if (!localStorage.getItem('token')) return alert('Please log in')
        if (voteBusy[postId]) return
        setVoteBusy(v => ({ ...v, [postId]: true }))

        try {
            await Client.post(`/votes/${postId}`, { type })
            await load()
        } catch (error) {
            console.error(error)
        } finally {
            setVoteBusy(v => ({ ...v, [postId]: false }))
        }
    }

    // Review writing style
    return (
    <div style={{ marginLeft: 200, padding: '1rem' }}>
      {/* Flash banner */}
      {flash && (
        <div style={{
          background:'#e6ffed',
          border:'1px solid #b7eb8f',
          color:'#135200',
          padding:'10px 12px',
          borderRadius:8,
          marginBottom:12
        }}>
          {flash}
        </div>
      )}

      <h1>Welcome {user?.username}!</h1>

      <div style={{ margin: '12px 0' }}>
        <button disabled={sort==='latest'} onClick={() => setSort('latest')}>Latest</button>
        <button style={{ marginLeft: 8 }} disabled={sort==='top'} onClick={() => setSort('top')}>Top</button>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No posts yet.</p>}

      {posts.map(p => (
        <div key={p._id} style={{ background:'#fff', border:'1px solid #ddd', borderRadius:8, padding:12, marginBottom:12 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <button onClick={() => vote(p._id, 'upvote')}>⬆️</button>
            <button onClick={() => vote(p._id, 'downvote')}>⬇️</button>
            <div>
              <h3 style={{ margin:'0 0 6px' }}>
                <Link to={`/posts/${p._id}`}>{p.title}</Link>
              </h3>
              <div style={{ fontSize:12, color:'#666' }}>
                in {p?.subverseId?.name} • by {p?.createdBy?.username}
              </div>
            </div>
          </div>

          {p.type === 'text' && p.content && <p style={{ marginTop:10 }}>{p.content}</p>}
          {p.type === 'image' && p.imageUrls?.length > 0 && (
            <div style={{ marginTop:10, display:'flex', gap:8, overflowX:'auto' }}>
              {p.imageUrls.map((src, i) => (
                <img key={i} src={src} alt="" style={{ maxHeight:180, borderRadius:8 }} />
              ))}
            </div>
          )}
          {p.type === 'video' && p.videoUrl && (
            <video style={{ width:'100%', marginTop:10, borderRadius:8 }} controls src={p.videoUrl} />
          )}
        </div>
      ))}
    </div>
  )

}

export default HomePage