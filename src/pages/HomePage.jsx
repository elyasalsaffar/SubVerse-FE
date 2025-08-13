// review later

// HomePage.jsx
import { useEffect, useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import Client from "../services/api"

// Detect YouTube links
const isYouTube = (url = '') =>
  /youtube\.com\/watch\?v=|youtu\.be\//i.test(url)

const toYouTubeEmbed = (url = '') => {
  try {
    const short = url.match(/youtu\.be\/([^?&]+)/i)
    if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`
    const u = new URL(url)
    const id = u.searchParams.get('v')
    if (id) return `https://www.youtube.com/embed/${id}`
    return url
  } catch {
    return url
  }
}

const HomePage = ({ user }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState("latest") // "latest" or "top"
  const [voteBusy, setVoteBusy] = useState({})
  const [flash, setFlash] = useState("")
  const [subverses, setSubverses] = useState([])
  const [subverseId, setSubverseId] = useState("")
  const [voteCounts, setVoteCounts] = useState({})

  const location = useLocation()
  const navigate = useNavigate()

  // Show flash banner from CreatePost
  useEffect(() => {
    if (location.state?.flash) {
      setFlash(location.state.flash)
      navigate(location.pathname, { replace: true, state: {} })
      const t = setTimeout(() => setFlash(""), 3000)
      return () => clearTimeout(t)
    }
  }, [location.state, location.pathname, navigate])

  // Load subverses
  useEffect(() => {
    const loadSubverses = async () => {
      try {
        const res = await Client.get("/subverses")
        setSubverses(res.data || [])
      } catch (e) {
        console.error(e)
      }
    }
    loadSubverses()
  }, [])

  // Load posts + vote counts
  const loadPosts = async () => {
    setLoading(true)
    try {
      let res
      // Change here depending on backend support
      if (sort === "latest") {
        res = await Client.get("/posts", { params: { sort: "latest", subverseId } })
      } else if (sort === "top") {
        res = await Client.get("/posts", { params: { sort: "top", subverseId } })
      }

      setPosts(res.data || [])

      // Fetch vote counts for each post
      const counts = {}
      for (let p of res.data || []) {
        try {
          const v = await Client.get(`/votes/${p._id}`)
          counts[p._id] = v.data
        } catch {
          counts[p._id] = { upvotes: 0, downvotes: 0 }
        }
      }
      setVoteCounts(counts)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [sort, subverseId])

  const vote = async (postId, type) => {
    if (!localStorage.getItem("token")) return alert("Please log in")
    if (voteBusy[postId]) return
    setVoteBusy(v => ({ ...v, [postId]: true }))

    try {
      await Client.post(`/votes/${postId}`, { type })
      const v = await Client.get(`/votes/${postId}`)
      setVoteCounts(prev => ({ ...prev, [postId]: v.data }))
    } catch (error) {
      console.error(error)
    } finally {
      setVoteBusy(v => ({ ...v, [postId]: false }))
    }
  }

  const deletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return
    try {
      await Client.delete(`/posts/${postId}`)
      await loadPosts()
    } catch (e) {
      console.error(e)
      alert("Failed to delete post")
    }
  }

  return (
    <div>
      {/* Flash banner */}
      {flash && (
        <div style={{
          background: '#e6ffed',
          border: '1px solid #b7eb8f',
          color: '#135200',
          padding: '10px 12px',
          borderRadius: 8,
          marginBottom: 12
        }}>
          {flash}
        </div>
      )}

      <h1>Welcome {user?.username}!</h1>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        flexWrap: 'wrap',
        margin: '12px 0'
      }}>
        <div>
          <label style={{ marginRight: 8 }}>Community:</label>
          <select value={subverseId} onChange={(e) => setSubverseId(e.target.value)}>
            <option value="">All</option>
            {subverses.map(s => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <button disabled={sort === 'latest'} onClick={() => setSort('latest')}>Latest</button>
          <button style={{ marginLeft: 8 }} disabled={sort === 'top'} onClick={() => setSort('top')}>Top</button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>No posts yet.</p>}

      {posts.map(p => {
        const isOwner = user?.id === p?.createdBy?._id
        const counts = voteCounts[p._id] || { upvotes: 0, downvotes: 0 }
        return (
          <div
            key={p._id}
            style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: '1rem',
              marginBottom: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center'
              }}>
                <button onClick={() => vote(p._id, 'upvote')} disabled={!!voteBusy[p._id]}>
                  ⬆️ {counts.upvotes}
                </button>
                <button onClick={() => vote(p._id, 'downvote')} disabled={!!voteBusy[p._id]}>
                  ⬇️ {counts.downvotes}
                </button>
                <div>
                  <h3 style={{ margin: '0 0 6px' }}>
                    <Link to={`/posts/${p._id}`}>{p.title}</Link>
                  </h3>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    in {p?.subverseId?.name} • by {p?.createdBy?.username}
                  </div>
                </div>
              </div>
              {isOwner && (
              <button
                onClick={() => deletePost(p._id)}
                style={{ color: '#b00' }}
              >
                Delete
              </button>
            )}

            {!isOwner && (
              <button
                onClick={async () => {
                  if (!localStorage.getItem('token')) return alert('Please log in')
                  if (window.confirm('Report this post’s creator?')) {
                    try {
                      await Client.post('/reports', {
                        reportedUserId: p.createdBy._id,
                        reason: 'Inappropriate content'
                      })
                      alert('Reported successfully')
                    } catch (err) {
                      alert(err.response?.data?.msg || 'Failed to report')
                    }
                  }
                }}
              >
                🚩 Report
              </button>
            )}

            </div>

            {/* Text post */}
            {p.type === 'text' && p.content && (
              <p style={{ marginTop: 10 }}>{p.content}</p>
            )}

            {/* Image post */}
            {p.type === 'image' && p.imageUrls?.length > 0 && (
              <div style={{
                marginTop: 10,
                display: 'flex',
                gap: 8,
                overflowX: 'auto'
              }}>
                {p.imageUrls.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    style={{ maxHeight: 180, borderRadius: 8 }}
                  />
                ))}
              </div>
            )}

            {/* Video post */}
            {p.type === 'video' && p.videoUrl && (
              isYouTube(p.videoUrl) ? (
                <div
                  style={{
                    marginTop: 10,
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0
                  }}
                >
                  <iframe
                    src={toYouTubeEmbed(p.videoUrl)}
                    title={p.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0,
                      borderRadius: 8
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  style={{ width: '100%', marginTop: 10, borderRadius: 8 }}
                  controls
                  src={p.videoUrl}
                />
              )
            )}
          </div>
        )
      })}
    </div>
  )
}

export default HomePage