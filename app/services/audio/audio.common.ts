import { Observable } from "rxjs/Observable";
import { ILogger } from "../logger.common";
import { Logger } from "../logger";
import { IAudioFile } from "../../models";

export enum EnumAudioState {
    STARTING,
    STOPPED
}

export interface IAudioService {
    handlePlayAudioTimes(
        audioFile: IAudioFile,
        startTime: number,
        stopTime: number
    );

    handlePlayAudioTimesObs(
        audioFile: IAudioFile,
        startTime: number,
        stopTime: number
    ): Observable<EnumAudioState>;
}

export abstract class AudioServiceCommon implements IAudioService {
    protected log: ILogger;

    constructor(logger: Logger) {
        this.log = logger.getLogger(AudioServiceCommon.name);
    }

    handlePlayAudioTimes(
        audioFile: IAudioFile,
        startTime: number,
        stopTime: number
    ) {
        let obs = this.handlePlayAudioTimesObs(audioFile, startTime, stopTime);

        obs.subscribe(as => {
            this.log.debug("Audio state", as);
        });
    }

    abstract handlePlayAudioTimesObs(
        audioFile: IAudioFile,
        startTime: number,
        stopTime: number
    ): Observable<EnumAudioState>;
}
