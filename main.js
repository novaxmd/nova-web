// NAVIGATION
const navToggle = document.getElementById('navToggle');
const closeNav = document.getElementById('closeNav');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');
const toolSections = document.querySelectorAll('.tool-section');
navToggle.addEventListener('click', () => { mainNav.classList.add('active'); });
closeNav.addEventListener('click', () => { mainNav.classList.remove('active'); });
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionId = link.getAttribute('data-section');
    toolSections.forEach(section => { section.classList.remove('active'); });
    document.getElementById(sectionId).classList.add('active');
    mainNav.classList.remove('active');
  });
});

// PARTICLE.JS
particlesJS('particles-js', {/* ...uweke config yako ya particles.js hapa... */});

// SYSTEM STATS (baki unchanged)
function updateStats() { /* ...original code... */ }
function updateNetworkSpeed() { /* ...original code... */ }
updateStats(); updateNetworkSpeed();
setInterval(updateStats, 1000); setInterval(updateNetworkSpeed, 5000);

// AUDIO CONTROLS (baki unchanged)
const audioControls = document.getElementById('audioControls');
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeControl = document.getElementById('volumeControl');
const closeAudioBtn = document.getElementById('closeAudioBtn');
setTimeout(() => {
  const playAudio = confirm('Would you like to play background music?');
  if (playAudio) { initAudioPlayer(); }
}, 3000);
function initAudioPlayer() { /* ...original code... */ }

// ==========================
// YOUTUBE DOWNLOADER (NEW)
// ==========================
const ytSearchBtn = document.getElementById('ytSearchBtn');
const ytSearchInput = document.getElementById('ytSearch');
const ytResults = document.getElementById('ytResults');
const ytLoader = document.getElementById('ytLoader');
// Load trending when section opens
document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('youtube').classList.contains('active')) {
    showTrendingVideos();
  }
});
document.querySelectorAll('.nav-link[data-section="youtube"]').forEach(btn => {
  btn.addEventListener('click', showTrendingVideos);
});
ytSearchBtn.addEventListener('click', searchYouTube);
ytSearchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchYouTube();
});
async function showTrendingVideos() {
  ytLoader.style.display = 'block';
  ytResults.innerHTML = '';
  ytSearchInput.value = '';
  try {
    const proxyUrl = 'https://corsproxy.io/?';
    const apiUrl = 'https://my-rest-apis-six.vercel.app/yts?query=trending';
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
    const data = await response.json();
    displayVideos(data.results || []);
  } catch (err) {
    ytResults.innerHTML = '<p>Error loading trending videos.</p>';
  } finally {
    ytLoader.style.display = 'none';
  }
}
async function searchYouTube() {
  const query = ytSearchInput.value.trim();
  if (!query) return showTrendingVideos();
  ytLoader.style.display = 'block';
  ytResults.innerHTML = '';
  try {
    const proxyUrl = 'https://corsproxy.io/?';
    const apiUrl = `https://my-rest-apis-six.vercel.app/yts?query=${encodeURIComponent(query)}`;
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
    const data = await response.json();
    displayVideos(data.results || []);
  } catch (error) {
    ytResults.innerHTML = '<p>Error fetching videos.</p>';
  } finally {
    ytLoader.style.display = 'none';
  }
}
function displayVideos(videos) {
  if (!videos.length) {
    ytResults.innerHTML = '<p>No videos found.</p>';
    return;
  }
  ytResults.innerHTML = videos.map(video => `
    <div class="video-card">
      <div class="video-thumbnail">
        <img src="${video.thumbnail}" alt="${video.title}">
      </div>
      <div class="video-info">
        <h3>${video.title}</h3>
        <div class="video-meta">
          <span>${video.author}</span>
          <span>${video.duration}</span>
        </div>
        <div class="video-actions">
          <button class="btn" onclick="playPreview('${video.url}', this)">
            <i class="fas fa-play"></i> Play
          </button>
          <a href="#" class="btn" onclick="downloadYouTube('${video.url}', 'mp3', this); return false;">
            <i class="fas fa-music"></i> MP3
          </a>
          <a href="#" class="btn" onclick="downloadYouTube('${video.url}', 'mp4', this); return false;">
            <i class="fas fa-video"></i> MP4
          </a>
        </div>
        <div class="video-preview" style="display:none; margin-top:10px;"></div>
      </div>
    </div>
  `).join('');
}
// Play preview (audio or video)
window.playPreview = async function(url, btn) {
  const card = btn.closest('.video-info');
  const previewDiv = card.querySelector('.video-preview');
  if (previewDiv.style.display === 'block') {
    previewDiv.innerHTML = '';
    previewDiv.style.display = 'none';
    btn.innerHTML = '<i class="fas fa-play"></i> Play';
    return;
  }
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
  try {
    const proxyUrl = 'https://corsproxy.io/?';
    const apiUrl = `https://iamtkm.vercel.app/downloaders/ytmp3?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
    const data = await response.json();
    if (data.data?.url) {
      previewDiv.innerHTML = `
        <audio controls autoplay style="width:100%;">
          <source src="${data.data.url}" type="audio/mp3">
          Your browser does not support audio.
        </audio>
      `;
      previewDiv.style.display = 'block';
      btn.innerHTML = '<i class="fas fa-times"></i> Close Preview';
    } else if (data.data?.videoUrl) {
      previewDiv.innerHTML = `
        <video controls autoplay style="width:100%; max-height:200px;">
          <source src="${data.data.videoUrl}" type="video/mp4">
          Your browser does not support video.
        </video>
      `;
      previewDiv.style.display = 'block';
      btn.innerHTML = '<i class="fas fa-times"></i> Close Preview';
    } else {
      previewDiv.innerHTML = '<p>Preview not available.</p>';
      previewDiv.style.display = 'block';
      btn.innerHTML = '<i class="fas fa-times"></i> Close Preview';
    }
  } catch (error) {
    previewDiv.innerHTML = '<p>Could not load preview.</p>';
    previewDiv.style.display = 'block';
    btn.innerHTML = '<i class="fas fa-times"></i> Close Preview';
  }
}
window.downloadYouTube = async function(url, format, element) {
  element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
  try {
    const proxyUrl = 'https://corsproxy.io/?';
    const apiUrl = `https://iamtkm.vercel.app/downloaders/yt${format}?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
    const data = await response.json();
    if (data.data?.url || data.data?.videoUrl) {
      const downloadUrl = data.data.url || data.data.videoUrl;
      window.open(downloadUrl, '_blank');
    } else {
      alert('Failed to get download link.');
    }
  } catch (error) {
    alert('Download failed.');
  } finally {
    element.innerHTML = format === 'mp3' 
      ? '<i class="fas fa-music"></i> MP3' 
      : '<i class="fas fa-video"></i> MP4';
  }
}

// APK, TikTok, Facebook Downloader scripts (weka code yako ya zamani unchanged kwenye file hii)
