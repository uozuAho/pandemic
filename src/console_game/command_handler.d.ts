type CommandHandlerydoo = (...args: string[]) => boolean | void;

export class Command {
    public name: string;
    public description: string;
    public handler: CommandHandlerydoo;

    constructor(name: string, description: string, handler: CommandHandlerydoo)
}

export class CommandHandler {
    constructor(commands: Command[])

    public runLoop(): () => void;
}