type CommandHandler = (...args: string[]) => boolean | void;

export class Command {
    public name: string;
    public description: string;
    public handler: CommandHandler;

    constructor(name: string, description: string, handler: CommandHandler)
}

export class CommandLoopRunner {
    constructor(commands: Command[])

    public run(): () => void;
}