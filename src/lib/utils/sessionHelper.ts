import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";

export const saveDataInSession = async (req: Request, name: string, value: unknown): Promise<void> => {
    if (!req.session) {
        throw new Error("Session not available");
    }
    const session: Session = req.session as unknown as Session;
    session.setExtraData(name, value);
};

export async function getSessionValue (req: Request, name: string): Promise<unknown> {
    if (!req.session) {
        return null;
    }
    const session: Session = req.session as unknown as Session;
    return session.getExtraData(name);
}
