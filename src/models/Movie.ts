import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  year?: string;
  imdbID?: string;
  tmdbID?: string;
  poster?: string;
  plot?: string;
  genre?: string;
  director?: string;
  actors?: string;
  rating?: string;
  runtime?: string;
  provider: 'omdb' | 'tmdb';
  externalId: string;
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    imdbID: {
      type: String,
      trim: true,
    },
    tmdbID: {
      type: String,
      trim: true,
    },
    poster: {
      type: String,
      trim: true,
    },
    plot: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    director: {
      type: String,
      trim: true,
    },
    actors: {
      type: String,
      trim: true,
    },
    rating: {
      type: String,
      trim: true,
    },
    runtime: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      required: [true, 'Provider is required'],
      enum: ['omdb', 'tmdb'],
    },
    externalId: {
      type: String,
      required: [true, 'External ID is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness per provider
MovieSchema.index({ provider: 1, externalId: 1 }, { unique: true });

// Text index for search
MovieSchema.index({ title: 'text', plot: 'text' });

export const Movie = mongoose.model<IMovie>('Movie', MovieSchema);
