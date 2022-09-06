const mongoose = require('mongoose');
try {
  (async () => {
    await mongoose.connect(
      'mongodb+srv://project:PcmosZ8yRVVfxry8@cluster0.ikebn.mongodb.net/?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log('MongoDB connected!!');
  })();
} catch (err) {
  console.log(err);
}

module.exports = mongoose;

//databse link: mongodb+srv://project:PcmosZ8yRVVfxry8@cluster0.ikebn.mongodb.net/?retryWrites=true&w=majority
