module.exports = (mongoose) => {
  const archiveSchema = new mongoose.Schema(
    {
      groupID: Number,
      name: String,
      image: String,
      users: Array,
      log: Array,
    },
    { timestamps: true }
  );
  const Archive = mongoose.model("archive", archiveSchema);
  return Archive;
};
