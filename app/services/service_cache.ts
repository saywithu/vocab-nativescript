import { Injectable } from "@angular/core";
import { IServiceCache, ServiceCacheKey } from "./service_cache.common";
import { Observable } from "rxjs/Observable";

import { of } from "rxjs/observable/of";
import { _throw } from "rxjs/observable/throw";
import { fromPromise } from "rxjs/observable/fromPromise";
import { mergeMap } from "rxjs/operators/mergeMap";

import * as fs from "tns-core-modules/file-system";
import * as _ from "lodash";

import { ad } from "tns-core-modules/utils/utils";
import {
    AndroidApplication,
    getNativeApplication
} from "tns-core-modules/application";

import { Constants } from "./constants";
import { HttpHelperServiceCommon, IsAudioFile } from "./http_helper.common";
import { Logger } from "./logger";
import { ILogger } from "./logger.common";

@Injectable()
export class ServiceCache implements IServiceCache {
    private log: ILogger;

    constructor(private logger: Logger) {
        this.log = logger.getLogger(ServiceCache.name);
    }

    Save<T>(key: ServiceCacheKey<T>, jsonData: T): Observable<string> {
        const jsonString = JSON.stringify(jsonData, null, 2);
        const jsonCacheFile = this.getCachedFile(key);

        if (_.isNil(jsonCacheFile)) {
            return _throw("JSON cache file is null");
        }

        return fromPromise(
            jsonCacheFile.writeText(jsonString).then(() => {
                // Succeeded writing to the file.
                return "Wrote sentence text, len = " + jsonString.length;
            })
        );
    }
    Load<T>(key: ServiceCacheKey<T>): Observable<T> {
        const jsonCacheFile = this.getCachedFile(key);

        if (_.isNil(jsonCacheFile)) {
            return _throw("JSON cache file is null");
        }
        this.log.debug("Load cache with key", key.keyStr);

        return fromPromise(jsonCacheFile.readText()).pipe(
            mergeMap(content => {
                // Successfully read the file's content.
                this.log.debug("Load cache, content length:", content.length);
                const parsedJson = JSON.parse(content);
                return of(parsedJson);
            })
        );
    }

    Clear<T>(key: ServiceCacheKey<T>): Observable<string> {
        this.log.debug("Clear Cache: ", key.keyStr);
        const jsonCacheFile = this.getCachedFile(key);

        if (_.isNil(jsonCacheFile)) {
            return _throw("JSON cache file is null");
        }
        return fromPromise(
            jsonCacheFile.remove().then(() => "Cleared cache " + key.keyStr)
        );
    }

    private getCachedFile<T>(key: ServiceCacheKey<T>): fs.File {
        const applicationContext: android.content.Context = ad.getApplicationContext();

        // Get the directory for the app's private pictures directory.
        const file: java.io.File = applicationContext.getExternalFilesDir(null);

        if (file == null) {
            return null;
        }

        const jsonCacheFolder = fs.Folder.fromPath(
            fs.path.join(file.getPath(), Constants.JSON_CACHE_FOLDER)
        );

        const jsonCacheFile = jsonCacheFolder.getFile(`${key.keyStr}.json`);
        this.log.trace("File path", jsonCacheFile.path);

        return jsonCacheFile;
    }
}
