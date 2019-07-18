import readlineSync from 'readline-sync';

export class Command {

    constructor(name, description, handler) {
        this.name = name;
        this.description = description;
        this.handler = handler;
    }
}

export class CommandLoopRunner {

    constructor(commands) {
        this._commands = commands;
    }

    run() {
        const readlineSyncInput = this._mapCommandsToReadlineSyncInput(this._commands);
        readlineSync.promptCLLoop(readlineSyncInput);
    }

    _mapCommandsToReadlineSyncInput(commands) {
        const readlineSyncInput = {};
        for (const command of commands) {
            readlineSyncInput[command.name] = command.handler;
        }
        return readlineSyncInput;
    }
}
