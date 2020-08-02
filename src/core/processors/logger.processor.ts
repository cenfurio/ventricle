import {IPropertyProcessor, Logger as LoggerAnnotation, Injectable} from "@/core/common";
import { Logger } from '@/util';

@Injectable()
export class LoggerAnnotationProcessor implements IPropertyProcessor<LoggerAnnotation> {
    isSupported(annotation: any): boolean {
        return annotation instanceof LoggerAnnotation;
    }

    process(instance: Object, propertyKey: string, annotation: LoggerAnnotation) {
        // TODO: Create LoggerService
        instance[propertyKey] = new Logger(annotation.module);
    }

}
