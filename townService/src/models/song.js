import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { Schema } = mongoose;

const songSchema = new Schema(
  {
    title: { type: String, required: true },
    creator: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number, required: true },
    likedUsers: { type: Array, required: true },
    notes: { type: Array, required: true },
  },
  { timestamps: true },
);

// eslint-disable-next-line @typescript-eslint/naming-convention
const Song = mongoose.model('Song', songSchema);
export default Song;
