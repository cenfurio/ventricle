import {MODULE_PROCESSORS, Type, Inject, Injectable, IModuleProcessor, Provider} from "../common";

export class StubModuleProcessor implements IModuleProcessor {
    process(type: Type<any>, providers: Provider[]) {
    }
}

@Injectable()
export class ModuleProcessor implements IModuleProcessor {
    constructor(@Inject(MODULE_PROCESSORS) private processors: IModuleProcessor[]) {
    }

    process(type: Type<any>, providers: Provider[]): void {
        this.processors.forEach(processor => processor.process(type, providers));
    }

}
