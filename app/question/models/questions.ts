import * as _ from "lodash";

export interface IQuestion {
    id: number;
    tags: Array<number>;
    rating: number;
    last_answered: Date | null;
    created: Date |null;
    question_en: string;
    question_ru: string;
    attempts: number;


    //polymorphic_ctype: number;
    resourcetype: string;
}

export class QuestionType {

    private static questionTypes: Array<QuestionType> = [];

    private constructor(public name: string, public readonly title: string) {
        QuestionType.questionTypes.push(this);
    }

    static readonly MultipleChoiceQuestion = new QuestionType(
        "MultipleChoiceQuestion", "Multiple Choice");

    static readonly FillInBlankQuestion = new QuestionType("FillInBlankQuestion",
        "Fill in the Blank");

    static getAll(): Array<QuestionType> {
        return QuestionType.questionTypes;
    }
}

export interface IFillInBlankQuestion extends IQuestion {
    answers: string[];
    positions: number[];
}

export interface IMultipleChoiceQuestion extends IQuestion {
    correct_answer_index: number;
    choices: string[];
}

function parenthesesAreBalanced(string) {
    let parentheses = "{}",
        stack = [],
        i, character, bracePosition;

    for (i = 0; character = string[i]; i++) {
        bracePosition = parentheses.indexOf(character);

        if (bracePosition === -1) {
            continue;
        }

        if (bracePosition % 2 === 0) {
            stack.push(bracePosition + 1); // push next expected brace position

            //Added to prevent nested {}
            if (stack.length >= 2) {
                return false;
            }
        } else {
            if (stack.length === 0 || stack.pop() !== bracePosition) {
                return false;
            }


        }
    }

    return stack.length === 0;
}

export function generate_fill_in_blank(raw_question_text): Partial<IFillInBlankQuestion> {
    if (!_.isString(raw_question_text)) {
        throw new Error("not a string");
    }
    if (!parenthesesAreBalanced(raw_question_text)) {
        throw new Error("{} are not balanced");
    }

    let r: Partial<IFillInBlankQuestion> = {
        positions: [],
        answers: []
    };


    let myRegexp = new RegExp("\{(.*?)\}", "g");
    let match = myRegexp.exec(raw_question_text);
    while (match != null) {
        r.positions.push(match.index);
        r.answers.push(match[1]);
        raw_question_text = raw_question_text.slice(0, match.index) + raw_question_text.slice(match.index + match[0].length);

        myRegexp.lastIndex = 0;
        match = myRegexp.exec(raw_question_text);
    }

    r.question_ru = raw_question_text;

    return r;
}


export type AllQuestionTypes = IFillInBlankQuestion | IMultipleChoiceQuestion;
