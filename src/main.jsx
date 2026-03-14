import React from 'react'
import ReactDOM from 'react-dom/client'

// Self-hosted fonts — required for html-to-image to work (Google Fonts CDN
// blocks cross-origin font fetching which html-to-image needs to embed fonts).
import '@fontsource/spectral/300.css'
import '@fontsource/spectral/400.css'
import '@fontsource/spectral/600.css'
import '@fontsource/spectral/300-italic.css'
import '@fontsource/spectral/400-italic.css'
import '@fontsource/dm-sans/300.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'

import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
