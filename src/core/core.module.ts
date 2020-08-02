import {Module, MODULE_PROCESSORS, ModuleWithProviders, PROPERTY_PROCESSORS} from "@/core/common";
import {
    EventListenerProcessor,
    LoggerAnnotationProcessor,
    ModuleProcessor,
    StubModuleProcessor
} from "@/core/processors";

@Module({
    providers: [
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders {
        return {
            module: CoreModule,
            providers: [
                ModuleProcessor,
                {
                    provide: MODULE_PROCESSORS,
                    useClass: StubModuleProcessor,
                    multi: true
                },
                {
                    provide: PROPERTY_PROCESSORS,
                    useClass: EventListenerProcessor,
                    multi: true
                },
                {
                    provide: PROPERTY_PROCESSORS,
                    useClass: LoggerAnnotationProcessor,
                    multi: true
                }
            ]
        }
    }
}
