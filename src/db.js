/*THIS IS JUST A DUMMY DB-MOCK-UP, IDEALLY MOST OF THIS WOULD BE DONE MORE EFFICIENTLY*/

import { join } from 'path';
import { v4 as uuid } from 'uuid';
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'

const copyObj = (obj) => JSON.parse(JSON.stringify(obj))
const dbFile = join(__dirname, '..', 'db.json');
const adapter = new FileSync(dbFile);
const db = low(adapter);
db.defaults({ artists: [], albums: [], songs: [] }).write();

const createArtist = (artist) => {
  const obj = { id: uuid(), ...artist, albums: [] };
  db.get('artists').push(obj).write();
  return obj;
}

const findArtistById = (id) => {
  return db.get('artists').find({ id }).value()
}

const findAlbumById = (id) => {
  return db.get('albums').find({ id }).value()
}

const createAlbum = (album) => {
  const obj = { id: uuid(), ...album, songs: [] };
  db.get('albums').push(obj).write();

  db.get('artists').find({ id: obj.artist }).get('albums').push(obj.id).write();

  return obj;
}

const createSong = (song) => {
  const obj = { id: uuid(), ...song };
  db.get('songs').push(obj).write();

  db.get('albums').find({ id: obj.album }).get('songs').push(obj.id).write();

  return obj;
}

const search = (like) => {
  const songs = copyObj(db.get('songs').value().filter(song => {
    return song.title.toLowerCase().includes(like.toLowerCase()) || 
           findArtistById(song.artist).name.toLowerCase().includes(like.toLowerCase());
  }))
  songs.forEach(song => {
    song.artist = findArtistById(song.artist)
    song.album = findAlbumById(song.album)
  });
  return songs
}

const getSongById = (id) => {
  const song = copyObj(db.get('songs').find({ id }).value())
  song.artist = findArtistById(song.artist)
  song.album = findAlbumById(song.album)
  return song
}

export default { createArtist, createAlbum, createSong, search, getSongById }
