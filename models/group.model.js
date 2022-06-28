module.exports = (mongoose) => {
  const groupSchema = new mongoose.Schema(
    {
      groupID: Number,
      name: String,
      image: {
        url: String,
        id: String,
      },
      users: Array,
      log: Array,
    },
    { timestamps: true }
  );
  const Group = mongoose.model("group", groupSchema);
  return Group;
};
