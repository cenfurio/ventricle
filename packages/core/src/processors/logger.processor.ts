import {Log, Injectable, Logger} from "@ventricle/common";
import {IPropertyProcessor} from "../common";

@Injectable()
export class LoggerAnnotationProcessor implements IPropertyProcessor<Log> {
    isSupported(annotation: any): boolean {
        return annotation instanceof Log;
    }

    process(instance: Object, propertyKey: string, annotation: Log) {
        // TODO: Create LoggerService
        instance[propertyKey] = new Logger(annotation.module, annotation.id);
    }
}
