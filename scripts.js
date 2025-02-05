// Obtener la API Key desde localStorage
function getApiKey() {
  return localStorage.getItem('X-RapidAPI-Key') || '';
}

// Guardar la API Key en localStorage
function saveApiKey() {
  const apiKey = document.getElementById('apiKeyInput').value.trim();
  if (apiKey) {
    localStorage.setItem('X-RapidAPI-Key', apiKey);
    document.getElementById('apiKeyMessage').classList.remove('d-none');
    setTimeout(() => {
      document.getElementById('apiKeyMessage').classList.add('d-none');
    }, 3000);
  }
}

// Descargar Reel
async function getReelData() {
  await fetchData('reelUrl', 'reel');
}

// Descargar Estado
async function getStatusData() {
  await fetchData('statusUrl', 'status');
}

// Descargar Videos de YouTube
async function getYouTubeData() {
  await fetchData('youtubeUrl', 'youtube');
}


// Descargar Short
async function getShortData() {
  await fetchData('shortUrl', 'short');
}

// Descargar Videos de TikTok
async function getTikTokData() {
  await fetchData('tiktokUrl', 'tiktok');
}


// Función genérica para manejar descargas
async function fetchData(inputId, prefix) {
  const videoUrl = document.getElementById(inputId).value.trim();
  const loading = document.getElementById(`${prefix}Loading`);
  const videoContainer = document.getElementById(`${prefix}VideoContainer`);
  const videoQuality = document.getElementById(`${prefix}VideoQuality`);
  const downloadLink = document.getElementById(`${prefix}DownloadLink`);
  const error = document.getElementById(`${prefix}Error`);

  if (!videoUrl) {
    showError(error, loading, 'Por favor ingresa una URL válida.');
    return;
  }

  try {
    loading.classList.remove('d-none');
    videoContainer.classList.add('d-none');
    error.classList.add('d-none');

    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('API Key no configurada. Por favor configúrala primero.');
    }

    const response = await fetch(
      `https://social-media-video-downloader.p.rapidapi.com/smvd/get/all?url=${encodeURIComponent(videoUrl)}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'social-media-video-downloader.p.rapidapi.com'
        }
      }
    );

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

    const data = await response.json();

    if (!data.links || !data.links.length) {
      throw new Error('No se encontraron videos descargables para esta URL.');
    }

    const truncatedTitle = data.title ? data.title.substring(0, 30) : 'video';
    videoQuality.textContent = truncatedTitle;
    if (prefix == 'short' || prefix == 'youtube') {
      downloadLink.href = data.links[8]?.link || "#";
    }
    else {
      downloadLink.href = data.links[1]?.link || "#";
    }
    downloadLink.download = `${prefix}_${truncatedTitle}.mp4`;

    videoContainer.classList.remove('d-none');
  } catch (err) {
    showError(error, loading, `Error: ${err.message}`);
  } finally {
    loading.classList.add('d-none');
  }
}
  

// Función para manejar errores y mostrarlos
function showError(errorElement, loadingElement, message) {
  errorElement.textContent = message;
  errorElement.classList.remove('d-none');
  loadingElement.classList.add('d-none');
}
