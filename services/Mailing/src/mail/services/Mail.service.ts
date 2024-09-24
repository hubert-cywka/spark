import { Injectable } from "@nestjs/common";

import { IMailService } from "@/mail/services/IMail.service";

@Injectable()
export class MailService implements IMailService {
    public test(payload: unknown): unknown {
        return payload;
    }
}
