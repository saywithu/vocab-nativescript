import * as _ from "lodash";

export class LinkType {
    private static linkTypes: Array<LinkType> = [];

    private constructor(
        public readonly description: string,
        private readonly template_url: string
    ) {
        LinkType.linkTypes.push(this);
    }

    private static WORD_TOKEN = "<<<word>>>";

    static readonly DICT = new LinkType(
        "Dict.com",
        `https://www.dict.com/Russian-English/${LinkType.WORD_TOKEN}`
    );
    static readonly W_EN = new LinkType(
        "Wiktionary (EN)",
        `https://en.wiktionary.org/wiki/${LinkType.WORD_TOKEN}`
    );
    static readonly W_RU = new LinkType(
        "Wiktionary (RU)",
        `https://ru.wiktionary.org/wiki/${LinkType.WORD_TOKEN}`
    );
    static readonly GOOGLE = new LinkType(
        "Google",
        `https://www.google.com/search?q=${LinkType.WORD_TOKEN}`
    );
    static readonly PRONOUNCE = new LinkType(
        "Pronounce",
        `https://forvo.com/word/${LinkType.WORD_TOKEN}/#ru`
    );
    static readonly ACADEMIC_RU = new LinkType(
        "Academic ru",
        `https://translate.academic.ru/${LinkType.WORD_TOKEN}/ru/en/`
    );
    static readonly GOOGLE_TRANSLATE = new LinkType(
        "google translate",
        `https://translate.google.com/#ru/en/${LinkType.WORD_TOKEN}`
    );

    get_url(russian_word: string): string {
        //remove {}
        let r_word = russian_word.replace(/[\{\}]/g, "").toLowerCase();
        return this.template_url.replace(
            LinkType.WORD_TOKEN,
            encodeURIComponent(r_word)
        );
    }

    static getAll(): Array<LinkType> {
        return LinkType.linkTypes;
    }
}

export function prefix_slash(path: string): string {
    return `/${path}`;
}

export function stringify(obj): string {
    const cache = [];
    return JSON.stringify(
        obj,
        (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        },
        2
    );
}

const mappings: Map<string, string> = new Map([
    ["ćh", "ч"],
    ["çh", "ч"],
    ["'ch", "ч"],
    ["'ts", "ц"],
    ["`h", "ъ"],
    ["bi", "ы"],
    //["'bl", "ы"],
    ["`b", "ь"],
    ["a", "а"],
    ["'b", "б"],
    ["b", "в"],
    ["g", "г"],
    ["d", "д"],
    ["e", "е"],
    ["ë", "ё"],
    ["j", "ж"],
    ["z", "з"],
    ["u", "и"],
    ["ú", "й"],
    ["k", "к"],
    ["l", "л"],
    ["m", "м"],
    ["h", "н"],
    ["o", "о"],
    ["n", "п"],
    ["p", "р"],
    ["c", "с"],

    ["t", "т"],
    ["y", "у"],
    ["f", "ф"],
    ["x", "х"],
    //["'ts", "ц"],

    ["'w", "щ"],
    ["w", "ш"],

    //["`h", "ъ"],

    ["ï", "ы"],
    //["'bi", "ы"],

    //["`b", "ь"],

    //non cyricil accented e
    ["é", "э"],
    ["ý", "ю"],
    ["r", "я"],

    ["а́", "а"],
    ["е́", "е"], //accented cyrillic e to cyrillic e
    ["о́", "о"], //accented cyrillic o to cyrillic o
    ["ы́", "ы"],
    ["я́", "я"],
    ["и́", "и"],
    ["у́", "у"],
    ["ю́", "ю"],
    ["э́", "э"],
    //in case we do use a ascii c, make it the cyrillic one

    ["<", "«"],
    [">", "»"]
]);

export function tokenize_sentence(sentence: string): string[] {
    const regexp = /([ ,?.…!-:;<«">»()]+)/gi;
    const retVal = [];
    let prev_match_index = 0;
    while (true) {
        // Look for the first match
        const matchOne = regexp.exec(sentence);
        if (matchOne == null) {
            break;
        }
        retVal.push(sentence.substring(prev_match_index, matchOne.index));
        retVal.push(sentence.substring(matchOne.index, regexp.lastIndex));

        prev_match_index = regexp.lastIndex;
    }

    if (sentence && prev_match_index < sentence.length) {
        retVal.push(sentence.substring(prev_match_index, sentence.length));
    }
    return retVal;
}

export function transliterate(enChars: string) {
    if (!_.isString(enChars)) {
        return enChars;
    }
    let transformed = enChars;
    mappings.forEach((ch_ru, ch_en: string) => {
        const ch_ru_upper = ch_ru.toUpperCase();
        const ch_en_upper = ch_en.toUpperCase();
        transformed = transformed.replace(new RegExp(ch_en, "g"), ch_ru);
        //         console.log("After " + ch_en + " => " + ch_ru, transformed);

        transformed = transformed.replace(
            new RegExp(ch_en_upper, "g"),
            ch_ru_upper
        );
        //
    });

    return transformed;
}

export function un_transliterate(ruChars: string) {
    if (!_.isString(ruChars)) {
        return ruChars;
    }
    mappings.forEach((ch_ru, ch_en: string) => {
        const ch_ru_upper = ch_ru.toUpperCase();
        const ch_en_upper = ch_en.toUpperCase();
        ruChars = ruChars.replace(new RegExp(ch_ru, "g"), ch_en);
        //         console.log("After " + ch_en + " => " + ch_ru, transformed);

        ruChars = ruChars.replace(new RegExp(ch_ru_upper, "g"), ch_en_upper);
        //
    });

    return ruChars;
}

export const RUSSIAN_ALPHABET = [
    "А а",
    "Б б",
    "В в",
    "Г г",
    "Д д",
    "Е е",
    "Ё ё",

    "Ж ж",
    "З з",
    "И и",
    "Й й",
    "К к",
    "Л л",
    "М м",

    "Н н",
    "О о",
    "П п",
    "Р р",
    "С с",
    "Т т",
    "У у",

    "Ф ф",
    "Х х",
    "Ц ц",
    "Ч ч",
    "Ш ш",
    "Щ щ",
    "Ъ ъ",

    "Ы ы",
    "Ь ь",
    "Э э",
    "Ю ю",
    "Я я"
];

// tslint:disable-next-line:no-unused-variable
export const RUSSIAN_ALPHABET_TRANSLITERATED = _.map(RUSSIAN_ALPHABET, ch =>
    un_transliterate(ch)
);

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

// private property
const _keyStr: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

// public method for encoding
export function base64_encode(input: string) {
    let output = "";
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;

    input = _utf8_encode(input);

    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output =
            output +
            _keyStr.charAt(enc1) +
            _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) +
            _keyStr.charAt(enc4);
    }

    return output;
}

// public method for decoding
export function base64_decode(input) {
    let output = "";
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
        }
    }

    output = _utf8_decode(output);

    return output;
}

// private method for UTF-8 encoding
function _utf8_encode(string) {
    string = string.replace(/\r\n/g, "\n");
    let utftext = "";

    for (let n = 0; n < string.length; n++) {
        let c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }

    return utftext;
}

// private method for UTF-8 decoding
function _utf8_decode(utftext) {
    let string = "";
    let i = 0;
    let c = 0,
        c2 = 0,
        c3 = 0;

    while (i < utftext.length) {
        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if (c > 191 && c < 224) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(
                ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
            );
            i += 3;
        }
    }

    return string;
}
