import {IPropertyProcessor, Logger as LoggerAnnotation, Injectable} from "../common";
import { GenericLogger } from '../../util';

@Injectable()
export class LoggerAnnotationProcessor implements IPropertyProcessor<LoggerAnnotation> {
    isSupported(annotation: any): boolean {
        return annotation instanceof LoggerAnnotation;
    }

    process(instance: Object, propertyKey: string, annotation: LoggerAnnotation) {
        // TODO: Create LoggerService
        instance[propertyKey] = new GenericLogger(annotation.module);
    }

}
