
// Review writin style
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Client from '../services/api'

const PostDetails = ({ user }) => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const p = await Client.get(`/posts/${id}`).then(r => r.data)
      setPost(p)
      const c = await Client.get(`/comments/${id}`).then(r => r.data)
      setComments(c)
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

  if (loading) return <div style={{ marginLeft:200, padding:'1rem' }}>Loading...</div>
  if (!post) return <div style={{ marginLeft:200, padding:'1rem' }}>Post not found.</div>

  return (
    <div style={{ marginLeft: 200, padding: '1rem' }}>
      <h2>{post.title}</h2>
      <div style={{ fontSize:12, color:'#666', marginBottom:8 }}>
        in {post?.subverseId?.name} • by {post?.createdBy?.username}
      </div>

      {post.type === 'text' && post.content && <p>{post.content}</p>}
      {post.type === 'image' && post.imageUrls?.length > 0 && (
        <div style={{ display:'flex', gap:8, overflowX:'auto' }}>
          {post.imageUrls.map((src, i) => (
            <img key={i} src={src} alt="" style={{ maxHeight:220, borderRadius:8 }} />
          ))}
        </div>
      )}
      {post.type === 'video' && post.videoUrl && (
        <video style={{ width:'100%', borderRadius:8 }} controls src={post.videoUrl} />
      )}

      <h3 style={{ marginTop:20 }}>Comments</h3>
      <form onSubmit={addComment} style={{ marginBottom:12 }}>
        <textarea rows={3} value={content} onChange={(e)=>setContent(e.target.value)} style={{ width:'100%' }} />
        <button type="submit" style={{ marginTop:8 }}>Add Comment</button>
      </form>

      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map(c => (
        <div key={c._id} style={{ borderTop:'1px solid #eee', padding:'8px 0' }}>
          <div style={{ fontSize:12, color:'#666' }}>{c.createdBy?.username}</div>
          <div>{c.content}</div>
        </div>
      ))}
    </div>
  )
}

export default PostDetails