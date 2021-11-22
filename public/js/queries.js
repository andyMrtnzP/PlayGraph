let playing;

async function search() {
  const like = document.getElementById("search").value;
  if (!like) {
    document.getElementById("app-content").innerHTML = emptyTemplate;
    return;
  }
  const query = `
    query Search($like: String!) {
      search(like: $like) {
        id,
        title,
        album {
          coverImg
        },
        artist {
          name
        }
      }
    }`;

  const data = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { like },
    })
  })
  const json = await data.json()
  if (!json || !json.data.search) {
    document.getElementById("app-content").innerHTML = emptyTemplate;
    return;
  }
  const searches =   json.data.search.map(song => {
    return `
      <div class="search-song-item" onclick="loadSong('${song.id}')">
        <div class="song-search-img">
          <img src="${song.album.coverImg}" />
        </div>
        <div class="song-search-info">
          <label class="song-info-title">${song.title}</label>
          <label class="song-info-artist">${song.artist.name}</label>
        </div>
      </div>
    `
  }).join(' ')
  const elem = `<div id="search-wrapper">
  ${searches}
  </div>`
  document.getElementById("app-content").innerHTML = elem
}

async function loadSong(id) {
  document.getElementById("search").value = "";
  const query = `
    query Song($id: ID!) {
      song(id: $id) {
        title,
        album {
          coverImg
        },
        filepath,
        artist {
          name
        }
      }
    }`;

  const data = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { id },
    })
  })
  const json = await data.json()
  playing = new Audio(json.data.song.filepath);
  playing.play()

  document.getElementById("app-content").innerHTML = `
  <div id="song-playing">
    <div class="song-playing-img">
      <img src="${json.data.song.album.coverImg}" />
    </div>
    <div class="song-playing-info">
      <label class="song-playing-artist">${json.data.song.artist.name}</label>
      <label class="song-playing-title">${json.data.song.title}</label>
    </div>

    <div class="play-btns">
      <img src="img/play-icon.png" id="btn-play" onclick="togglePlay(this)" style="display: none" />
      <img src="img/pause-icon.png" id="btn-pause" onclick="togglePlay(this)" style="display: unset" />
    </div>
  </div>
`

  document.getElementById("cover-background").style.backgroundImage = `url(${json.data.song.album.coverImg})`
  document.getElementById("cover-background").style.display = "block"
  document.getElementById("cover-shadow").style.display = "block"
}

function togglePlay() {
  if (playing.paused) {
    document.getElementById("btn-play").style.display = "none"
    document.getElementById("btn-pause").style.display = "unset"
    playing.play()
  } else {
    document.getElementById("btn-play").style.display = "unset"
    document.getElementById("btn-pause").style.display = "none"
    playing.pause()
  }
}
