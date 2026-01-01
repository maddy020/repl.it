"use client";
import "./page.css"
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit"
import { useEffect, useRef } from "react";
import {  Socket } from "socket.io-client";
import { useParams } from "next/navigation";
export default function CodingTerminal({socket}:{socket:Socket | null}) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const { repl } = useParams();
    function ab2str(buf: ArrayBuffer) {
        return String.fromCharCode.apply(null, [...new Uint8Array(buf)]);
    }
    useEffect(() => {
        const term = new Terminal();
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        if (terminalRef && terminalRef.current) term.open(terminalRef.current);
        fitAddon.fit();
        const dataHandler = ({data}: {data: ArrayBuffer}) => {
            if (data instanceof ArrayBuffer) term.write(ab2str(data));
        }
        socket?.emit("requestTerminal", { replId: repl && repl[0] });
        socket?.on("terminal", dataHandler)
        term.onData((data) => {
            switch (data) {
                case "\r":
                    socket?.emit("terminalData", { data: "\n" });
                    break;
                case "\x7F":
                    socket?.emit("terminalData", { data: "\b" });
                    break;
                case "\x1B[D":
                    socket?.emit("terminalData", { data: "\x1B[D" });
                    break;
                case "\x1B[C":
                    socket?.emit("terminalData", { data: "\x1B[C" });
                    break;
                default:
                    socket?.emit("terminalData", { data });
                    break;
            }
        });
        return () => {
            socket?.off("terminal", dataHandler);
            term.dispose();
        }
    }, [socket, terminalRef])
    return (
        <div ref={terminalRef}>
        </div>
    )
}