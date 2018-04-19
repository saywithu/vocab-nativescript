import { Injectable } from "@angular/core";
import { TraceWriter } from "tns-core-modules/trace/trace";

import { ad } from "tns-core-modules/utils/utils";

import * as fs from "tns-core-modules/file-system";
import { Constants } from "./constants";
import * as trace from "tns-core-modules/trace";
import * as _ from "lodash";
import { stringify } from "../common/utils/String";
import { ILogger, LogLevel } from "./logger.common";

export interface ILogEntry {
    message: string;
    category: string;
    level: LogLevel;
    date: Date;
}

@Injectable()
export class Logger implements TraceWriter {
    private writer: java.io.BufferedWriter;
    private nsWriter: java.io.BufferedWriter;
    logEntries: Array<ILogEntry>;

    private init_log_file() {
        const applicationContext: android.content.Context = ad.getApplicationContext();

        // Get the directory for the app's private pictures directory.
        const appDataDir: java.io.File = applicationContext.getExternalFilesDir(
            null
        );

        if (appDataDir == null) {
            return null;
        }

        const logFolder = fs.Folder.fromPath(
            fs.path.join(appDataDir.getPath(), Constants.LOG_FOLDER)
        );

        //this.logFile = logFolder.getFile("app.log");

        const file = new java.io.File(logFolder.path + "/app.log");
        file.createNewFile();
        const filewriter = new java.io.FileWriter(file, false);
        this.writer = new java.io.BufferedWriter(filewriter);

        const nsFile = new java.io.File(logFolder.path + "/ns.log");
        nsFile.createNewFile();
        const nsFilewriter = new java.io.FileWriter(nsFile, false);
        this.nsWriter = new java.io.BufferedWriter(nsFilewriter);
    }

    constructor() {
        this.logEntries = [];
        this.init_log_file();

        trace.setCategories(
            trace.categories.concat(
                trace.categories.Binding,
                trace.categories.Debug,
                trace.categories.NativeLifecycle,
                trace.categories.Error,
                trace.categories.Layout,
                trace.categories.NativeLifecycle,
                trace.categories.Navigation,
                trace.categories.Style
                //trace.categories.ViewHierarchy
                //trace.categories.VisualTreeEvents
            )
        );

        trace.enable();

        trace.addWriter(this);
    }
    write(message: any, category?: string, type?: number) {
        this.nsWriter.write(
            `Category: ${category} Message: ${message}\n Type: ${type}`
        );
    }

    getLogger(category: string): ILogger {
        return {
            trace: (msg, ...dataList) =>
                this.logMessage(msg, category, LogLevel.TRACE, dataList),
            debug: (msg, ...dataList) =>
                this.logMessage(msg, category, LogLevel.DEBUG, dataList),
            info: (msg, ...dataList) =>
                this.logMessage(msg, category, LogLevel.INFO, dataList),
            warning: (msg, ...dataList) =>
                this.logMessage(msg, category, LogLevel.WARNING, dataList),
            error: (msg, ...dataList) =>
                this.logMessage(msg, category, LogLevel.WARNING, dataList)
        };
    }

    logMessage(
        message: string,
        category: string,
        level: LogLevel,
        objectsToPrint?: Array<any>
    ) {
        //Keep the length of the log cache in check
        if (_.size(this.logEntries) > 100) {
            this.logEntries = this.logEntries.slice(
                this.logEntries.length - 50
            );
        }

        this.logEntries.push({
            level,
            message,
            category,
            date: new Date()
        });

        let logMessage = `${_.padStart(LogLevel[level], 8)} ${_.padStart(
            category,
            25,
            " "
        )}: ${message}\n`;
        this.writer.write(logMessage);

        console.log(logMessage);

        if (_.size(objectsToPrint) > 0) {
            for (let dataItem of objectsToPrint) {
                let stringifiedItem = stringify(dataItem);
                this.writer.write(`${stringifiedItem}\n`);
                console.log(stringifiedItem);
                this.logEntries.push({
                    level: null,
                    message: stringifiedItem,
                    category: null,
                    date: null
                });
            }
        }
        this.writer.flush();
    }
}
