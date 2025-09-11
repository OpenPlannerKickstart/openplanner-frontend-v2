import { setupWorker } from 'msw/browser';
import { groupsHandlers } from './handlers/groups';

export const worker = setupWorker(...groupsHandlers);


