import { FormalQuoteRequest } from "../types";

export const emailService = {
    /**
     * Mocks sending quote documents to the customer and Al Etihad.
     * In a real app, this would call a backend API (Edge Function) 
     * which then uses an email provider like SendGrid, Postmark, or AWS SES.
     */
    sendQuoteDocuments: async (req: FormalQuoteRequest): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            // Simulate API latency
            setTimeout(() => {
                const customerEmail = req.customer.email;
                const alEtihadEmail = "gestion@lovepomegranate.com";

                console.log(`[EmailService MOCK] Sending documents for Quote #${req.quoteResult.referenceId}`);
                console.log(`[EmailService MOCK] DESTINATION 1 (Customer): ${customerEmail}`);
                console.log(`[EmailService MOCK] DESTINATION 2 (Al Etihad): ${alEtihadEmail}`);
                console.log(`[EmailService MOCK] ATTACHMENTS: Customer_Offer.pdf, Issuance_Request.pdf`);

                resolve({
                    success: true,
                    message: `Documents successfully sent to ${customerEmail} and Al Etihad (${alEtihadEmail})`
                });
            }, 1500);
        });
    },

    /**
     * Mocks sending a welcome email with login credentials.
     */
    sendWelcomeEmail: async (email: string, password: string, name: string): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`[EmailService MOCK] Sending Welcome Email to ${name} (${email})`);
                console.log(`[EmailService MOCK] CONTENT: Welcome to Rommaana! Your account has been created.`);
                console.log(`[EmailService MOCK] CREDENTIALS: ID: ${email}, Password: ${password}`);
                console.log(`[EmailService MOCK] LOGIN URL: http://localhost:5173/login`);
                resolve();
            }, 1000);
        });
    }
};
