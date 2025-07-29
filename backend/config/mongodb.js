import mongoose from 'mongoose'

const connectDB = async () => {

    mongoose.connection.on("connected", () => {
        console.log("DB Connected");
    })
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/codeScreen`);
    } catch (error) {
        console.error(`${process.env.MONGODB_URL}/codeScreen`);
        console.log("Failed to connect : ",error);
        process.exit(1);
    }
}
export default connectDB;