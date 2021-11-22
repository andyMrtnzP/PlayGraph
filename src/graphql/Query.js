export default {
  search(_parent, args, {db}) {
    return db.search(args.like);
  },
  song(_parent, args, {db}) {
    return db.getSongById(args.id);
  }
};
