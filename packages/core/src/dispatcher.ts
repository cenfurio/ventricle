import {Injectable} from "@ventricle/common";

export type EventHandler = (...args: any[]) => Promise<void>;

export interface EventListener {
    eventName: string;
    handler: EventHandler;
    priority: number;
}

@Injectable()
export class EventDispatcher {
    private eventListenerMap = new Map<string, EventListener[]>();

    /**
     * Adds an event listener
     *
     * @param eventName
     * @param handler
     * @param priority
     */
    public addListener(eventName: string, handler: EventHandler, priority = 0) {
        this.getEventListeners(eventName).push({
            eventName,
            handler,
            priority
        });
    }

    /**
     * Gets all event listeners of the specified event name.
     *
     * @param eventName
     */
    public getEventHandlers(eventName: string) {
        return this.getEventListeners(eventName)
            .sort((a, b) => b.priority - a.priority)
            .map(o => o.handler);
    }

    /**
     * Checks whether an event has any registered event listeners.
     *
     * @param eventName
     */
    public hasEventHandlers(eventName: string) {
        return this.getEventHandlers(eventName).length > 0;
    }

    /**
     * Removes all event listeners of a given event name.
     *
     * @param eventName
     */
    public removeEventHandlers(eventName: string) {
        this.eventListenerMap.delete(eventName);
    }

    public async dispatch(eventName: string, ...args: any[]): Promise<void> {
        const listeners = this.getEventHandlers(eventName);
        if (listeners.length > 0) {
            await this.doDispatch(listeners, ...args);
        }
    }

    /**
     * Gets all observers of an particular event
     *
     * @param eventName The event name
     */
    private getEventListeners(eventName: string) {
        if (!this.eventListenerMap.has(eventName)) {
            this.eventListenerMap.set(eventName, []);
        }

        return this.eventListenerMap.get(eventName)!;
    }

    private async doDispatch(listeners: EventHandler[], ...args: any[]): Promise<void> {
        return listeners.reduce((current: Promise<void>, next: EventHandler): Promise<void> => {
            return current.then(async (): Promise<void> => {
                return await next.call(this, ...args) as any;
            });

        }, Promise.resolve());
    }
}
