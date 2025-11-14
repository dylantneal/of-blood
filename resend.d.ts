declare module 'resend' {
  export class Resend {
    constructor(apiKey?: string);
    emails: {
      send(data: {
        from: string;
        to: string | string[];
        subject: string;
        html?: string;
        text?: string;
        replyTo?: string;
      }): Promise<{
        id: string;
        error?: any;
      }>;
    };
  }
}

