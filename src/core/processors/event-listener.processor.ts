import {EventDispatcher} from "../dispatcher";
import {EventListener, IPropertyProcessor, Injectable} from "../common";

@Injectable()
export class EventListenerProcessor implements IPropertyProcessor<EventListener>{
    constructor(private dispatcher: EventDispatcher) {
    }

    isSupported(annotation: any): boolean {
        return annotation instanceof EventListener;
    }

    process(instance: Object, propertyKey: string, annotation: EventListener) {
        this.dispatcher.addListener(
            annotation.eventName,
            instance[propertyKey].bind(instance),
            annotation.priority
        );
    }

}
