import { Request } from "express";
import { Session } from "@companieshouse/node-session-handler";

export async function getSessionValue (req: Request, name: string): Promise<unknown> {
    if (!req.session) {
        return null;
    }
    const session: Session = req.session as unknown as Session;
    return session.getExtraData(name);
}
