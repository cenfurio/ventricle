import {EventListener, Injectable} from "@ventricle/common";
import {IPropertyProcessor} from "../common";
import {EventDispatcher} from "../dispatcher";

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
