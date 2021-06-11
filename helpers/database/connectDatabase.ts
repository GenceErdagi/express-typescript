import mongoose from "mongoose";

const connectDatabase = () => {
  const { MONGO_URI } = process.env;
  mongoose.connect(MONGO_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex:true
    })
    .then(() => {
      console.log("MongoDb Connection Succesful");
    })
    .catch((error) => console.error(error));
};
export default connectDatabase;
