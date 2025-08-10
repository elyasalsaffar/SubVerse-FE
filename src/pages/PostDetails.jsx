// review later

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Client from '../services/api'

const PostDetails = ({ user }) => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const [voteCounts, setVoteCounts] = useState({ upvotes: 0, downvotes: 0 })
  const [voteBusy, setVoteBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const p = await Client.get(`/posts/${id}`).then(r => r.data)
      setPost(p)
      const c = await Client.get(`/comments/${id}`).then(r => r.data)
      setComments(c)

      // Get vote counts for this post
      try {
        const v = await Client.get(`/votes/${id}`).then(r => r.data)
        setVoteCounts(v)
      } catch (err) {
        console.error('Failed to fetch votes', err)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const addComment = async (e) => {
    e.preventDefault()
    if (!localStorage.getItem('token')) return alert('Please log in')
    if (!content.trim()) return
    await Client.post('/comments', { postId: id, content })
    setContent('')
    const c = await Client.get(`/comments/${id}`).then(r => r.data)
    setComments(c)
  }

  const vote = async (type) => {
    if (!localStorage.getItem('token')) return alert('Please log in')
    if (voteBusy) return
    setVoteBusy(true)
    try {
      await Client.post(`/votes/${id}`, { type })
      const v = await Client.get(`/votes/${id}`).then(r => r.data)
      setVoteCounts(v)
    } catch (err) {
      console.error(err)
    } finally {
      setVoteBusy(false)
    }
  }

  if (loading) return <div style={{ marginLeft: 200, padding: '1rem' }}>Loading...</div>
  if (!post) return <div style={{ marginLeft: 200, padding: '1rem' }}>Post not found.</div>

  return (
    <div style={{ marginLeft: 200, padding: '1rem' }}>
      <h2>{post.title}</h2>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        in {post?.subverseId?.name} • by {post?.createdBy?.username}
      </div>

      {/* Voting section */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <button onClick={() => vote('upvote')} disabled={voteBusy}>
          ⬆️ {voteCounts.upvotes}
        </button>
        <button onClick={() => vote('downvote')} disabled={voteBusy}>
          ⬇️ {voteCounts.downvotes}
        </button>
      </div>

      {post.type === 'text' && post.content && <p>{post.content}</p>}
      {post.type === 'image' && post.imageUrls?.length > 0 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {post.imageUrls.map((src, i) => (
            <img key={i} src={src} alt="" style={{ maxHeight: 220, borderRadius: 8 }} />
          ))}
        </div>
      )}
      {post.type === 'video' && post.videoUrl && (
        <video style={{ width: '100%', borderRadius: 8 }} controls src={post.videoUrl} />
      )}

      <h3 style={{ marginTop: 20 }}>Comments</h3>
      <form onSubmit={addComment} style={{ marginBottom: 12 }}>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%' }}
        />
        <button type="submit" style={{ marginTop: 8 }}>Add Comment</button>
      </form>

      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map(c => (
        <div key={c._id} style={{ borderTop: '1px solid #eee', padding: '8px 0' }}>
          <div style={{ fontSize: 12, color: '#666' }}>{c.createdBy?.username}</div>
          <div>{c.content}</div>
        </div>
      ))}
    </div>
  )
}

export default PostDetails