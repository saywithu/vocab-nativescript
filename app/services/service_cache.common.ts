import {Observable} from 'rxjs/Observable';
import { IAudioFile } from '../models';
import { ISentence } from '../sentence/models';
import { SentenceStateToPersist } from '../sentence/store/reducers';
import { IWord } from '../word/models/word';
import {IQuestion} from "../question/models/questions";
import { ISelectedTagIds } from '../question/store/reducers';

export class ServiceCacheKey<T>
{
    public static QUESTIONS_KEY = new ServiceCacheKey<IQuestion[]>("questions");
    public static AUDIO_FILES_KEY = new ServiceCacheKey<IAudioFile[]>("audioFiles");
    public static WORDS_KEY = new ServiceCacheKey<Array<IWord>>("words");

    public static QUESTION_TAGS_KEY = new ServiceCacheKey<ISelectedTagIds>("question_tags");

    public static GET_SENTENCES_CACHE_KEY(id: number)
    {
        return new ServiceCacheKey<ISentence[]>("sentences" + id);
    }

    public static PERSISTENT_STORE_STATE_KEY = new ServiceCacheKey<SentenceStateToPersist>("storeState");

    private constructor(public keyStr: string)
    {

    }
}


export interface IServiceCache
{
    //Returns a status
    Save<T>(key: ServiceCacheKey<T>, data: T) : Observable<string>;

    Clear<T>(key: ServiceCacheKey<T>) : Observable<string>;

    Load<T>(key: ServiceCacheKey<T>) : Observable<T>;
}

