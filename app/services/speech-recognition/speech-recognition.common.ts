export interface ISpeechRecognitionTranscription {
  text: string;
  finished: boolean;
  // confidence: number; // TODO some day
}

export interface ISpeechRecognitionOptions {
  /**
   * Example: "nl-NL".
   * Default: the system locale.
   */
  locale?: string;

  /**
   * Set to true to get results back continuously.
   */
  returnPartialResults?: boolean;

  /**
   * The callback function invoked when speech is recognized.
   * @param transcription
   */
  onResult: (transcription: ISpeechRecognitionTranscription) => void;
}

export interface ISpeechRecognitionApi {
  available(): Promise<boolean>;
  requestPermission(): Promise<boolean>;
  startListening(options: ISpeechRecognitionOptions): Promise<boolean>;
  stopListening(): Promise<any>;
}