import os from "os";
import { spawn } from "node-pty";
import type { IPty } from "node-pty";

const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

export class TerminalManager {
    private sessions: { [id: string]: { terminal: IPty, replId: string } } = {};

    constructor() {
        this.sessions = {}
    }
    createTerminal(id: string, replId: string, onData: (data: string, id: IPty) => void) {
        const term = spawn(shell, [], {
            name: "xterm",
            cols: 80,
            rows: 24,
            cwd:`/workspace`,
        })
        term.onData((data: string) => {
            onData(data, term.pid as unknown as IPty);
        })
        this.sessions[id] = { replId: replId, terminal: term};
        term.onExit(() => {
            delete this.sessions[id];
        });
        return term;
    }

    write(terminalId: string, data: string) {
        console.log("writing to terminal", terminalId, data,this.sessions[terminalId]);
        this.sessions[terminalId]?.terminal.write(data);
    }

    clear(terminalId: string) {
        this.sessions[terminalId]?.terminal.kill();
        delete this.sessions[terminalId];
    }

};