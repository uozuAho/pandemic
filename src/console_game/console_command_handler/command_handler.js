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
        this._commands.push(new Command('q', 'quit', () => true));
        this._commands.push(new Command('l', 'list available commands', () => { this._printHelp(); }));
    }

    run() {
        console.log('Running the thing');
        this._printHelp();
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

    _printHelp() {
        for (const command of this._commands) {
            console.log(`${command.name}: ${command.description}`);
        }
    }
}
