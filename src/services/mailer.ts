import sgMail from '@sendgrid/mail';
import { config } from '../config/env';

export interface WelcomeEmailData {
  name: string;
  email: string;
  city: string;
}

export class MailerService {
  private static initialized = false;

  private static initialize(): void {
    if (!this.initialized) {
      sgMail.setApiKey(config.sendgrid.apiKey);
      this.initialized = true;
    }
  }

  static async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    this.initialize();

    const msg = {
      to: data.email,
      from: config.sendgrid.fromEmail,
      subject: 'Welcome to Movies + Weather App! 🎬🌤️',
      html: this.generateWelcomeEmailHTML(data),
      text: this.generateWelcomeEmailText(data),
    };

    try {
      await sgMail.send(msg);
      console.log(`✅ Welcome email sent to ${data.email}`);
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      throw new Error('Failed to send welcome email');
    }
  }

  private static generateWelcomeEmailHTML(data: WelcomeEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Movies + Weather App</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { margin: 20px 0; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #667eea; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Welcome to Movies + Weather App! 🌤️</h1>
              <p>Hi ${data.name}, we're excited to have you on board!</p>
            </div>
            <div class="content">
              <p>Welcome to your new favorite app for discovering movies and checking the weather in ${data.city}!</p>
              
              <div class="feature">
                <h3>🎬 Movie Discovery</h3>
                <p>Search for your favorite movies, read plots, and save them to your personal favorites list.</p>
              </div>
              
              <div class="feature">
                <h3>🌤️ Weather Updates</h3>
                <p>Get real-time weather information for ${data.city} right on your dashboard.</p>
              </div>
              
              <div class="feature">
                <h3>💝 Personal Favorites</h3>
                <p>Build your own collection of favorite movies and access them anytime.</p>
              </div>
              
              <p>Ready to get started? Log in to your account and start exploring!</p>
              
              <p>Happy movie watching and stay weather-aware! 🍿</p>
            </div>
            <div class="footer">
              <p>Movies + Weather App Team</p>
              <p>This email was sent to ${data.email}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private static generateWelcomeEmailText(data: WelcomeEmailData): string {
    return `
Welcome to Movies + Weather App! 🎬🌤️

Hi ${data.name},

Welcome to your new favorite app for discovering movies and checking the weather in ${data.city}!

Here's what you can do:

🎬 Movie Discovery
Search for your favorite movies, read plots, and save them to your personal favorites list.

🌤️ Weather Updates
Get real-time weather information for ${data.city} right on your dashboard.

💝 Personal Favorites
Build your own collection of favorite movies and access them anytime.

Ready to get started? Log in to your account and start exploring!

Happy movie watching and stay weather-aware! 🍿

Movies + Weather App Team
This email was sent to ${data.email}
    `;
  }
}
