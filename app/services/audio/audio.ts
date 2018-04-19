import * as fs from "tns-core-modules/file-system";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { fromPromise } from "rxjs/observable/fromPromise";
import { catchError } from "rxjs/operators/catchError";
//import {Rx} from "rxjs/Rx";
//import "rxjs/add/operator/map";
import "rxjs/add/operator/do";
import "rxjs/add/observable/of";
//import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/toPromise";

import { ad } from "tns-core-modules/utils/utils";
import { map } from "rxjs/operators/map";
import {
    AndroidApplication,
    getNativeApplication
} from "tns-core-modules/application";
//import { Observable } from "tns-core-modules/ui/editable-text-base/editable-text-base";
import { Constants } from "../constants";

import { TNSPlayer } from "nativescript-audio";
import * as Permissions from "nativescript-permissions";

import {
    HttpHelperServiceCommon,
    IsAudioFile
} from "../http_helper.common";
import * as _ from "lodash";
import { ILogger } from "../logger.common";
import { Logger } from "../logger";
import { Observer } from "rxjs/Observer";
import {
    IAudioService,
    EnumAudioState,
    AudioServiceCommon
} from "./audio.common";
import { IAudioFile } from "../../models";
import { ISentence } from "../../sentence/models";

declare var android: any;

@Injectable()
export class AudioService extends AudioServiceCommon
    implements IAudioService {
    private _player: TNSPlayer;
    private _lastStopTimeout;

    constructor(private httpHelper: HttpHelperServiceCommon, logger: Logger) {
        super(logger);

        this._player = new TNSPlayer();
        this._player.debug = true; // set true to enable TNSPlayer console logs for debugging.
    }

    getAudioFilePath(audioFile: IAudioFile): string {
        let applicationContext: android.content.Context = ad.getApplicationContext();

        // Get the directory for the app's private pictures directory.
        let file: java.io.File = applicationContext.getExternalFilesDir(null);

        let musicPath = android.os.Environment.getExternalStoragePublicDirectory(
            android.os.Environment.DIRECTORY_MUSIC
        ).toString();

        let combinedPath = fs.path.join(musicPath, audioFile.audio_path);
        console.log("Returning " + combinedPath);
        return combinedPath;
    }

    private getCachedFile(): fs.File {
        //let androidApp:AndroidApplication = getNativeApplication();
        let applicationContext: android.content.Context = ad.getApplicationContext();

        // Get the directory for the app's private pictures directory.
        const file: java.io.File = applicationContext.getExternalFilesDir(null);

        const jsonCacheFolder = fs.Folder.fromPath(
            fs.path.join(file.getPath(), Constants.JSON_CACHE_FOLDER)
        );

        const jsonCacheFile = jsonCacheFolder.getFile("audioFiles.json");
        console.log("File path", jsonCacheFile.path);

        return jsonCacheFile;
    }

    saveAudioFiles(audioFiles: IAudioFile[]) {
        const jsonString = JSON.stringify(audioFiles, null, 2);

        const jsonCacheFile = this.getCachedFile();

        jsonCacheFile.writeText(jsonString).then(
            () => {
                // Succeeded writing to the file.
                console.log("Wrote audio text");
            },
            (error) => {
                // Failed to write to the file.
                console.error("Failed", error);
            }
        );
    }
    private extractData(res: IAudioFile[]) {
        try {
            console.log("extractData");
            //console.dir(res[0]);
            this.saveAudioFiles(res);
            return res; // as AudioFile[];
        } catch (ex) {
            console.error(ex);
            return [];
        }
    }

    getAudioFiles(): Observable<IAudioFile[]> {
        //return Observable.of([]);

        let jsonCacheFile = this.getCachedFile();

        return fromPromise(jsonCacheFile.readText())
            .pipe(
                catchError(err => {
                    console.error("Error reading cache", err);
                    return "No JSON";
                })
            )
            .map(content => {
                // Successfully read the file's content.
                //console.log("Read content", content);
                const audioFiles = JSON.parse(content);
                if (audioFiles.length < 2) {
                    throw new Error("Not enough files in cache");
                }

                return audioFiles;
            })
            .pipe(
                catchError(err => {
                    console.error("Error parsing JSON", err);
                    return this.httpHelper.getAudioFilesFromInternet().pipe(
                        map(audioFiles => {
                            this.saveAudioFiles(audioFiles);
                            return audioFiles;
                        })
                    );
                })
            )
            .map((audioFiles: IAudioFile[]) => {
                return audioFiles.slice(15, 47);
            });
    }

    handlePlayAudio(audioFile: IAudioFile, currentSentence: ISentence): void {
        this.handlePlayAudioTimes(
            audioFile,
            currentSentence.audio_start_time,
            currentSentence.audio_stop_time
        );
    }

    handlePlayAudioTimesObs(
        audioFile: IAudioFile,
        startTime: number,
        stopTime: number
    ): Observable<EnumAudioState> {
        return Observable.create((obs: Observer<EnumAudioState>) => {
            try {
                this.handlePlayAudioTimesHelper(
                    audioFile,
                    startTime,
                    stopTime,
                    obs
                    // resolve,
                    // reject
                );
            } catch (err) {
                obs.error(err);
            }
        });
    }

    private async handlePlayAudioTimesHelper(
        audioFile: IAudioFile,
        startTime: number,
        stopTime: number,
        obs: Observer<EnumAudioState>
        //resolve: (a: any) => void,
        //reject: (a: any) => void
    ) {
        const audioFilePath = this.getAudioFilePath(audioFile);
        console.log(`Audio Path ${audioFilePath}`);

        await Permissions.requestPermission(
            android.Manifest.permission.READ_EXTERNAL_STORAGE,
            "Needed to read music"
        );

        this.log.debug("Permission granted!");
        await this._player.initFromFile({
            audioFile: audioFilePath,
            loop: false,
            completeCallback: this._trackComplete.bind(this),
            errorCallback: this._trackError.bind(this)
        });

        let duration = await this._player.getAudioTrackDuration();

        // iOS: duration is in seconds
        // Android: duration is in milliseconds
        const seekToTime = 1000 * startTime;
        const stopTimeMs = 1000 * stopTime;
        this.log.debug(`song duration: ${duration}.
                Seek to ${seekToTime / 1000} Stop ${stopTimeMs / 1000}`);

        await this._player.seekTo(seekToTime);

        obs.next(EnumAudioState.STARTING);

        await this._player.play();

        //The timeout return value is actually not a real number
        if (!_.isNil(this._lastStopTimeout)) {
            this.log.debug(
                "Cleared timeout"
                //this._lastStopTimeout
            );
            clearTimeout(this._lastStopTimeout);
        }

        this._lastStopTimeout = setTimeout(() => {
            this._player.pause();
            this._player.dispose().then(() => {
                this.log.debug("Player disposed");
            });
            //this._lastStopTimeout = null;
            obs.next(EnumAudioState.STOPPED);
            obs.complete();
        }, stopTimeMs - seekToTime);

        this.log.trace(
            "Set timeout"
            //this._lastStopTimeout
        );
    }

    private _trackComplete(args: any) {
        console.log("reference back to player:", args.player);
        // iOS only: flag indicating if completed succesfully
        console.log("whether song play completed successfully:", args.flag);
    }

    private _trackError(args: any) {
        console.log("reference back to player:", args.player);
        console.log("the error:", args.error);
        // Android only: extra detail on error
        console.log("extra info on the error:", args.extra);
    }
}
