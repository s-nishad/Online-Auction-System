const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


try {
  (async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    console.log('MongoDB connected!!');
  })();
} catch (err) {
  console.log(err);
}

module.exports = mongoose;
