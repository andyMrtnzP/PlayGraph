export default {
  createArtist(_parent, args, { db }) {
    return db.createArtist(args.data);
  },
  createAlbum(_parent, args, { db }) {
    return db.createAlbum(args.data)
  },
  createSong(parent, args, { db }) {
    return db.createSong(args.data)
  }
};
