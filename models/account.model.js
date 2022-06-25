module.exports = (mongoose) => {
  const accountSchema = new mongoose.Schema(
    {
      username: String,
      email: String,
      contact: Number,
      password: String,
      image: String,
      transactions: Array,
      pending: Array,
      groupLog: Array,
    },
    { timestamps: true }
  );

  const Account = mongoose.model("user", accountSchema);
  return Account;
};
