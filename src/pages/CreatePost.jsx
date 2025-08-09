// Review later

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Client from '../services/api'

const CreatePost = () => {
  const navigate = useNavigate()

  const [subverses, setSubverses] = useState([])
  const [loadingSubs, setLoadingSubs] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // form state
  const [subverseId, setSubverseId] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')              // always available (text body)
  const [imageUrls, setImageUrls] = useState([''])        // optional (one or more)
  const [videoUrl, setVideoUrl] = useState('')            // optional (single)
  const [error, setError] = useState('')

  // load subverses for dropdown
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

  // helpers for images list
  const addImage = () => setImageUrls((prev) => [...prev, ''])
  const updateImage = (i, val) =>
    setImageUrls((prev) => prev.map((x, idx) => (idx === i ? val : x)))
  const clearImages = () => setImageUrls([''])

  // ensure mutual exclusivity in UI
  const onVideoChange = (val) => {
    setVideoUrl(val)
    if (val) clearImages() // if user types a video URL, clear images
  }
  const onImageChange = (i, val) => {
    if (videoUrl) setVideoUrl('') // if user adds images, clear video
    updateImage(i, val)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')

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

    // Backend decides type based on presence of images/video (content is always included)
    const payload = {
      title,
      content,
      subverseId,
      imageUrls: images,
      videoUrl: videoUrl || ''
    }

    try {
      await Client.post('/posts', payload)

      // Redirect to home with a flash message (HomePage reads location.state.flash)
      navigate('/home', { state: { flash: '✅ Post created successfully.' } })
    } catch (e) {
      console.error(e)
      setError(e?.response?.data?.msg || 'Failed to create post')
      setSubmitting(false)
    }
  }

  return (
    <div style={{ marginLeft: 200, padding: '1rem' }}>
      <h2>Create Post</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 720 }}>
        {/* Subverse dropdown */}
        <label>Community (Subverse)</label><br />
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

        <br /><br />

        {/* Title */}
        <label>Title</label><br />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="What’s on your mind?"
          style={{ width: '100%' }}
          disabled={submitting}
        />

        <br /><br />

        {/* Text body is always present (like Reddit text posts) */}
        <label>Text</label><br />
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Say something…"
          style={{ width: '100%' }}
          disabled={submitting}
        />

        <br /><br />

        {/* Optional media: either images OR a single video */}
        <fieldset style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
          <legend>Optional Media</legend>

          {/* IMAGES */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong>Image URLs</strong>
              {videoUrl && <span style={{ color: '#b00' }}> (cleared if you type a video)</span>}
            </div>
            {imageUrls.map((url, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input
                  value={url}
                  onChange={(e) => onImageChange(i, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={{ flex: 1 }}
                  disabled={submitting}
                />
              </div>
            ))}
            <button type="button" onClick={addImage} style={{ marginTop: 8 }} disabled={submitting}>
              + Add image
            </button>
          </div>

          <div style={{ height: 12 }} />

          {/* VIDEO */}
          <div>
            <strong>Video URL</strong>
            {imageUrls.some(Boolean) && <span style={{ color: '#b00' }}> (images will be cleared)</span>}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input
                value={videoUrl}
                onChange={(e) => onVideoChange(e.target.value)}
                placeholder="https://example.com/video.mp4"
                style={{ flex: 1 }}
                disabled={submitting}
              />
            </div>
          </div>
        </fieldset>

        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

        <br />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create'}
        </button>
      </form>
    </div>
  )
}

export default CreatePost