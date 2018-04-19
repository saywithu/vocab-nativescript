import { IAudioFile } from "../../models";


export type Lesson = IAudioFile;


export interface ISentence {
    text_fr: string;
    text_ru: string;
    audio_file_id: number;
    audio_file: IAudioFile;
    audio_start_time: number;
    audio_stop_time: number;
    sentence_number: number;

    known_confidence: number;
    known_updated: string;
    id: number;
    notes: string;

    word_audio_start_time: number | null;
    word_audio_stop_time: number | null;
}


/*
type Partial<T> = {
    [P in keyof T]?: T[P];
}*/
type PartialSentenceT = Partial<ISentence>;

export interface IPartialSentence extends PartialSentenceT {
    /*text_fr: string;
    text_ru: string;
    audio_file_id: number;*/
}