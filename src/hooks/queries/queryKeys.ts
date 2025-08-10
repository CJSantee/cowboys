import { CowboyId } from '../../types';

export const cowboyKeys = {
  all: ['cowboys'] as const,
  cowboy: (cowboy_identifier: CowboyId | string) => [...cowboyKeys.all, cowboy_identifier] as const,
};

export const photoKeys = {
  all: ['photos'] as const,
};

export const leaderboard = ['leaderboard'] as const;

export const charter = ['charter'] as const;
