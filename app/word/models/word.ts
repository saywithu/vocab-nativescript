import { IAudioFile } from "../../models";

export interface IWord {
    readonly id: number;
    word_ru: string;
    word_en: string;
    example_ru: string;
    example_en: string;
    notes: string;
    known_confidence: number;
    word_audio_start_time: number;
    word_audio_stop_time: number;
    audio_file: IAudioFile;
    tags: Array<Number>;
}

export interface ITag {
    readonly name: string;
    readonly id: number;
}
