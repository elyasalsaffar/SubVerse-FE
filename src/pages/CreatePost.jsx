// review later

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Client from '../services/api'

const CreatePost = ({ user }) => {
  const navigate = useNavigate()

  const [subverses, setSubverses] = useState([])
  const [loadingSubs, setLoadingSubs] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // form state
  const [subverseId, setSubverseId] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')              
  const [imageUrls, setImageUrls] = useState([''])        
  const [videoUrl, setVideoUrl] = useState('')            
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoadingSubs(true)
      try {
        const res = await Client.get('/subverses')
        setSubverses(res.data || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingSubs(false)
      }
    }
    load()
  }, [])

  const addImage = () => setImageUrls((prev) => [...prev, ''])
  const updateImage = (i, val) =>
    setImageUrls((prev) => prev.map((x, idx) => (idx === i ? val : x)))
  const clearImages = () => setImageUrls([''])

  const onVideoChange = (val) => {
    setVideoUrl(val)
    if (val) clearImages()
  }
  const onImageChange = (i, val) => {
    if (videoUrl) setVideoUrl('')
    updateImage(i, val)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')

    if (user?.isSuspended) {
    setSubmitting(false)
    return alert('Your account is suspended from creating new posts')
    }

    if (!localStorage.getItem('token')) {
      setSubmitting(false)
      return alert('Please log in')
    }

    if (!subverseId) {
      setSubmitting(false)
      return setError('Please choose a subverse.')
    }

    const images = imageUrls.filter(Boolean)
    if (images.length > 0 && videoUrl) {
      setSubmitting(false)
      return setError('Choose either images or a video, not both.')
    }

    const payload = {
      title,
      content,
      subverseId,
      imageUrls: images,
      videoUrl: videoUrl || ''
    }

    try {
      await Client.post('/posts', payload)
      navigate('/home', { state: { flash: '✅ Post created successfully.' } })
    } catch (e) {
      console.error(e)
      setError(e?.response?.data?.msg || 'Failed to create post')
      setSubmitting(false)
    }
  }

  return (
    <div className="create-post-container">
      <h2>Create Post</h2>

      <form onSubmit={handleSubmit} className="create-post-form">
        <label>Community (Subverse)</label>
        <select
          value={subverseId}
          onChange={(e) => setSubverseId(e.target.value)}
          disabled={loadingSubs || submitting}
          required
        >
          <option value="" disabled>
            {loadingSubs ? 'Loading…' : 'Select a subverse'}
          </option>
          {subverses.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="What’s on your mind?"
          disabled={submitting}
        />

        <label>Text</label>
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Say something…"
          disabled={submitting}
        />

        <fieldset>
          <legend>Optional Media</legend>

          {/* IMAGES */}
          <div>
            <div className="label-row">
              <strong>Image URLs</strong>
              {videoUrl && <span className="warn-text"> (cleared if you type a video)</span>}
            </div>
            {imageUrls.map((url, i) => (
              <div key={i} className="input-row">
                <input
                  value={url}
                  onChange={(e) => onImageChange(i, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={submitting}
                />
              </div>
            ))}
            <button type="button" className="add-image-btn" onClick={addImage} disabled={submitting}>
              + Add image
            </button>
          </div>

          {/* VIDEO */}
          <div style={{ marginTop: '1rem' }}>
            <strong>Video URL</strong>
            {imageUrls.some(Boolean) && <span className="warn-text"> (images will be cleared)</span>}
            <div className="input-row">
              <input
                value={videoUrl}
                onChange={(e) => onVideoChange(e.target.value)}
                placeholder="https://example.com/video.mp4"
                disabled={submitting}
              />
            </div>
          </div>
        </fieldset>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create'}
        </button>
      </form>

      {/* CSS in the same file */}
      <style>{`
        .create-post-container {
          margin-left: 200px;
          padding: 1rem;
        }

        .create-post-form {
          max-width: 720px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        label {
          font-weight: 500;
        }

        select,
        input,
        textarea {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          width: 100%;
        }

        textarea {
          resize: vertical;
        }

        fieldset {
          border: 1px solid #eee;
          padding: 12px;
          border-radius: 8px;
        }

        legend {
          font-weight: bold;
        }

        .label-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .warn-text {
          color: #b00;
          font-size: 0.9rem;
        }

        .input-row {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .add-btn {
          margin-top: 8px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 0.4rem 0.6rem;
          cursor: pointer;
        }

        .error-message {
          color: red;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }

        .submit-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.6rem;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
        }

        .submit-btn:hover:not(:disabled) {
          background: #1d4ed8;
        }
      `}</style>
    </div>
  )
}

export default CreatePost