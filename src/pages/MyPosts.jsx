// review later

// MyPosts.jsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Client from "../services/api"

// Detect YouTube link
const isYouTube = (url = '') =>
  /youtube\.com\/watch\?v=|youtu\.be\//i.test(url)

// Convert YouTube link to embed URL
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

const MyPosts = ({ user }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [voteCounts, setVoteCounts] = useState({})
  const [voteBusy, setVoteBusy] = useState({})

  const loadPosts = async () => {
    setLoading(true)
    try {
      // Fetch all posts, then filter client-side
      const res = await Client.get("/posts", { params: { sort: "latest" } })
      const mine = (res.data || []).filter(p => p?.createdBy?._id === user?.id)
      setPosts(mine)

      // Load vote counts
      const counts = {}
      for (let p of mine) {
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
    if (user?.id) loadPosts()
  }, [user?.id])

  const vote = async (postId, type) => {
    if (!localStorage.getItem("token")) return alert("Please log in")
    if (voteBusy[postId]) return
    setVoteBusy(v => ({ ...v, [postId]: true }))
    try {
      await Client.post(`/votes/${postId}`, { type })
      const v = await Client.get(`/votes/${postId}`)
      setVoteCounts(prev => ({ ...prev, [postId]: v.data }))
    } catch (err) {
      console.error(err)
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
    <div style={{ marginLeft: 200, padding: "1rem" }}>
      <h1>My Posts</h1>
      {loading && <p>Loading...</p>}
      {!loading && posts.length === 0 && <p>You haven’t posted anything yet.</p>}

      {posts.map(p => {
        const counts = voteCounts[p._id] || { upvotes: 0, downvotes: 0 }
        return (
          <div key={p._id} style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button onClick={() => vote(p._id, "upvote")} disabled={!!voteBusy[p._id]}>
                  ⬆️ {counts.upvotes}
                </button>
                <button onClick={() => vote(p._id, "downvote")} disabled={!!voteBusy[p._id]}>
                  ⬇️ {counts.downvotes}
                </button>
                <div>
                  <h3 style={{ margin: "0 0 6px" }}>
                    <Link to={`/posts/${p._id}`}>{p.title}</Link>
                  </h3>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    in {p?.subverseId?.name}
                  </div>
                </div>
              </div>
              <button onClick={() => deletePost(p._id)} style={{ color: "#b00" }}>
                Delete
              </button>
            </div>

            {/* Text post */}
            {p.type === 'text' && p.content && (
              <p style={{ marginTop: 10 }}>{p.content}</p>
            )}

            {/* Image post */}
            {p.type === 'image' && p.imageUrls?.length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', gap: 8, overflowX: 'auto' }}>
                {p.imageUrls.map((src, i) => (
                  <img key={i} src={src} alt="" style={{ maxHeight: 180, borderRadius: 8 }} />
                ))}
              </div>
            )}

            {/* Video post */}
            {p.type === 'video' && p.videoUrl && (
              isYouTube(p.videoUrl) ? (
                <div style={{ marginTop: 10, position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src={toYouTubeEmbed(p.videoUrl)}
                    title={p.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, borderRadius: 8 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video style={{ width: '100%', marginTop: 10, borderRadius: 8 }} controls src={p.videoUrl} />
              )
            )}
          </div>
        )
      })}
    </div>
  )
}

export default MyPosts