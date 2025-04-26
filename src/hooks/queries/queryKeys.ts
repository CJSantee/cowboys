export const cowboyKeys = {
  all: ['cowboys'] as const,
  cowboy: (cowboy_id: number) => [...cowboyKeys.all, cowboy_id] as const,
};

export const photoKeys = {
  all: ['photos'] as const,
};

export const leaderboard = ['leaderboard'] as const;