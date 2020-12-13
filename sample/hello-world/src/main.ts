import {bootstrapFromModule} from '@ventricle/bootstrap';
import {Module} from '@ventricle/common';
import {CoreModule} from "@ventricle/core";

@Module({
    imports: [CoreModule.forRoot()]
})
class AppModule {}

bootstrapFromModule(AppModule);