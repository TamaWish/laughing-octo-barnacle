import { LifeEvent } from '../types/events';

export const LIFE_EVENTS: LifeEvent[] = [
  {
    id: 'event-lottery',
    description: 'You won the lottery!',
    effects: {
      money: 1000000,
      happiness: 50,
    },
  },
  {
    id: 'event-car-accident',
    description: 'You were in a car accident.',
    effects: {
      health: -20,
      happiness: -20,
      money: -5000,
    },
  },
  {
    id: 'event-promotion',
    description: 'You received a promotion at work!',
    effects: {
      money: 10000,
      happiness: 20,
    },
  },
  {
    id: 'event-illness',
    description: 'You came down with a serious illness.',
    effects: {
      health: -30,
      happiness: -30,
    },
  },
  {
    id: 'event-viral-video',
    description: 'A video of you went viral!',
    effects: {
      fame: 30,
      happiness: 20,
    },
  },
  {
    id: 'event-investment-success',
    description: 'A recent investment paid off big time!',
    effects: {
      money: 50000,
      happiness: 25,
    },
  },
];