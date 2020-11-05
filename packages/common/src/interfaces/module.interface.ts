import {Provider, Type} from "injection-js";

export interface ModuleMetadata {
    providers?: Provider[];
    imports?: (Type<any> | ModuleWithProviders)[];
}

export interface ModuleWithProviders {
    module: Type<any>;
    providers: Provider[];
}
