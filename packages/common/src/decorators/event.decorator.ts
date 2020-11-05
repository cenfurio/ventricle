import { makePropDecorator } from '../util';

export interface EventListener {
    eventName: string;
    priority: number;
}

export const EventListener = makePropDecorator('EventListener', (eventName: string, priority?: number) => ({ eventName, priority }));