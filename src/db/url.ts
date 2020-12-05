import mongoose from 'mongoose';

type UrlDoc = mongoose.Document & {
  _id: string;
  url: string;
  path: string;
  hitCount: number;
  userId?: string;
};

const collectionName = 'Urls';

const urlSchema = new mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    url: String,
    path: String,
    hitCount: Number,
    userId: {
      type: String,
      required: false,
    },
  },
  { collection: collectionName, versionKey: false },
);

export { UrlDoc };
export default mongoose.model<UrlDoc>(collectionName, urlSchema, collectionName);
