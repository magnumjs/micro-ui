import { Counter } from '../components/Counter.js';
import { WelcomeCard } from '../components/WelcomeCard.js';
import { AuthCard } from '../components/AuthCard.js';

export const components = [
  {
    name: 'Counter',
    Component: Counter,
    controls: {
      count: { type: 'number', default: 0 },
    },
  },
  {
    name: 'WelcomeCard',
    Component: WelcomeCard,
    controls: {
      user: {
        type: 'object',
        default: { name: 'Alice' },
      },
    },
  },
  {
    name: 'AuthCard',
    Component: AuthCard,
    controls: {
      user: {
        type: 'object',
        default: null,
      },
    },
  },
];
