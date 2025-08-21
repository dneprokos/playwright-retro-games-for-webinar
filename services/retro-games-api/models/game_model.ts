export interface Game {
  _id: string;
  name: string;
  genre: string;
  platforms: string[];
  releaseDate: string; // ISO date string
  hasMultiplayer: boolean;
  description: string;
  imageUrl: string;
  rating: number;
  createdBy: string | null;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface GamePagination {
  currentPage: number;
  totalPages: number;
  totalGames: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GetGamesResponse {
  games: Game[];
  pagination: GamePagination;
}
