import { ISentence, Lesson } from "../sentence/models";

 
export const lessonData1 : Lesson[] = [
    {
        id: 1,
        exercise_number: "4",
        audio_path: "a/b/c",
        source: "aa"
    },
    {
        id: 1,
        exercise_number: "5",
        audio_path: "a/b/c",
        source: "aa"
    }
]; 

export const lessonData2: Lesson[] = [
    {
        id: 1,
        exercise_number: "5",
        audio_path: "a/b/c",
        source: "aa"
    },
    {
        id: 1,
        exercise_number: "6",
        audio_path: "a/b/c",
        source: "aa"
    }
];

export const testSentences1: ISentence[] = [
    {
        "id": 175,
        "audio_file_id": 23,
        "text_fr": "Un rêve",
        "text_ru": "Сон",
        "notes": null,
        "known_confidence": 4,
        "known_updated": "2018-01-24T06:01:18.550847Z",
        "sentence_number": null,
        "audio_start_time": 3.0,
        "audio_stop_time": 5.0,
        "word_audio_start_time": null,
        "word_audio_stop_time": null,
        "audio_file": {
            "id": 23,
            "audio_path": "assimil/russian assimil 1/23 Leçon 23.mp3",
            "exercise_number": "23",
            "source": "Assimil"
        }
    }
];

export const testSentences2: ISentence[] = [
    {
        "id": 181,
        "audio_file_id": 23,
        "text_fr": "Mais pourquoi demain ?",
        "text_ru": "А почему завтра?",
        "notes": null,
        "known_confidence": 2,
        "known_updated": "2018-01-27T21:03:55.749718Z",
        "sentence_number": 6,
        "audio_start_time": 1.0,
        "audio_stop_time": 30.0,
        "word_audio_start_time": null,
        "word_audio_stop_time": null,
        "audio_file": {
            "id": 23,
            "audio_path": "assimil/russian assimil 1/23 Leçon 23.mp3",
            "exercise_number": "23",
            "source": "Assimil"
        }
    },
    {
        "id": 180,
        "audio_file_id": 23,
        "text_fr": "Merci, je prendrai le médicament demain",
        "text_ru": "Спасибо, я приму лекарство завтра.",
        "notes": null,
        "known_confidence": 0,
        "known_updated": "2018-01-27T21:03:35.522823Z",
        "sentence_number": 5,
        "audio_start_time": 2.0,
        "audio_stop_time": 27.0,
        "word_audio_start_time": null,
        "word_audio_stop_time": null,
        "audio_file": {
            "id": 23,
            "audio_path": "assimil/russian assimil 1/23 Leçon 23.mp3",
            "exercise_number": "23",
            "source": "Assimil"
        }
    },
    {
        "id": 179,
        "audio_file_id": 23,
        "text_fr": "Voice un médicament ; ce cauchemar cessera.",
        "text_ru": "Вот лекарство ; этот кошмар прекратится.",
        "notes": null,
        "known_confidence": 0,
        "known_updated": "2018-01-27T21:02:54.511895Z",
        "sentence_number": 4,
        "audio_start_time": 3.0,
        "audio_stop_time": 22.0,
        "word_audio_start_time": null,
        "word_audio_stop_time": null,
        "audio_file": {
            "id": 23,
            "audio_path": "assimil/russian assimil 1/23 Leçon 23.mp3",
            "exercise_number": "23",
            "source": "Assimil"
        }
    },
    {
        "id": 178,
        "audio_file_id": 23,
        "text_fr": "que des rats jouent au foot.",
        "text_ru": "что крысы играют в футбол.",
        "notes": null,
        "known_confidence": 0,
        "known_updated": "2018-01-27T21:01:50.305383Z",
        "sentence_number": 3,
        "audio_start_time": 4.0,
        "audio_stop_time": 17.0,
        "word_audio_start_time": null,
        "word_audio_stop_time": null,
        "audio_file": {
            "id": 23,
            "audio_path": "assimil/russian assimil 1/23 Leçon 23.mp3",
            "exercise_number": "23",
            "source": "Assimil"
        }
    },
]
