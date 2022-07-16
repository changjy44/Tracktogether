module.exports = (mongoose) => {
  const classificationSchema = new mongoose.Schema(
    {
      description: String,
      classification: Number,
    },
    { timestamps: true }
  );

  const Classification = mongoose.model("classification", classificationSchema);
  return Classification;
};
