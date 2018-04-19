import { ServiceCache } from "./service_cache";

import { RemoteDataService } from "./remote_data.common";
import { HttpHelperServiceCommon } from "./http_helper.common";
import { Logger } from "./logger";
import { MetaReducerLogger } from "./reducer_logger";
import { AudioService } from "./audio/audio";

export const SHARED_PROVIDERS: any[] = [
    AudioService,
    RemoteDataService,
    HttpHelperServiceCommon,
    ServiceCache,
    Logger,
    MetaReducerLogger
];
