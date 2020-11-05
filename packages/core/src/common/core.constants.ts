import {InjectionToken} from "@ventricle/common";
import {IModuleProcessor, IPropertyProcessor} from "./core.interfaces";

export const MODULE_PROCESSORS = new InjectionToken<IModuleProcessor[]>('Module Processors');

export const PROPERTY_PROCESSORS = new InjectionToken<IPropertyProcessor<any>[]>('Property Metadata Processors');
