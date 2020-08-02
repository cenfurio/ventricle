import {Provider} from "injection-js";

import {ModuleResolver} from "./module.resolver";
import {Application} from "./application";
import {EventDispatcher} from "./dispatcher";

export const CORE_PROVIDERS: Provider[] = [
    Application,
    ModuleResolver,
    EventDispatcher
];
