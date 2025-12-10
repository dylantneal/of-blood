/**
 * Email templates for Of Blood newsletter
 * 
 * Design philosophy: Premium band experience
 * - Uses actual brand assets (logo, album art, band photo)
 * - Gold corner frames matching website aesthetic
 * - Rich, layered visual design
 * - Clean language, stunning presentation
 */

const COLORS = {
  background: '#000000',
  cardBg: '#0A0A0A',
  primary: '#B30A0A',
  gold: '#C9A227',
  goldMuted: '#8B7019',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#666666',
  border: '#1C1C1C',
  borderLight: '#2A2A2A',
};

interface WelcomeEmailProps {
  isResubscribe?: boolean;
  siteUrl?: string;
}

/**
 * Welcome email sent when someone joins the newsletter
 */
export function getWelcomeEmailHtml({ isResubscribe = false, siteUrl = 'https://of-blood.com' }: WelcomeEmailProps = {}): string {
  const heading = isResubscribe 
    ? "You're already on the list."
    : "You're in.";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome | Of Blood</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Georgia, serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.background}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.background};">
    <tr>
      <td align="center" style="padding: 0;">
        
        <!-- Main container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
          
          <!-- Inbox tip - minimal -->
          <tr>
            <td style="padding: 16px 24px 0; text-align: center;">
              <p style="margin: 0; font-size: 10px; color: ${COLORS.textMuted}; letter-spacing: 0.3px;">
                Move to Primary · Add <span style="color: ${COLORS.textSecondary};">newsletter@of-blood.com</span> to contacts
              </p>
            </td>
          </tr>
          
          <!-- Top gold accent bar -->
          <tr>
            <td style="padding: 24px 20px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td height="2" style="background: linear-gradient(90deg, transparent 0%, ${COLORS.gold}50 15%, ${COLORS.gold} 50%, ${COLORS.gold}50 85%, transparent 100%);"></td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Hero Section with Album Art -->
          <tr>
            <td style="padding: 0 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.cardBg}; border-left: 1px solid ${COLORS.border}; border-right: 1px solid ${COLORS.border};">
                
                <!-- Symbol + Brand -->
                <tr>
                  <td align="center" style="padding: 40px 40px 32px;">
                    <img src="${siteUrl}/images/logos/OfBloodSymbol.png" alt="" width="40" height="40" style="display: block; border: 0; opacity: 0.8;" />
                    <p style="margin: 16px 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 10px; color: ${COLORS.gold}; letter-spacing: 6px; text-transform: uppercase;">
                      OF BLOOD
                    </p>
                  </td>
                </tr>
                
                <!-- Main Heading -->
                <tr>
                  <td align="center" style="padding: 0 32px;">
                    <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 48px; font-weight: 400; color: ${COLORS.text}; letter-spacing: -1px; line-height: 1.1;">
                      ${heading}
                    </h1>
                    <p style="margin: 16px 0 0; font-size: 17px; color: ${COLORS.textSecondary}; line-height: 1.5;">
                      Thanks for joining the newsletter.
                    </p>
                  </td>
                </tr>
                
                <!-- Album Art Hero - Framed -->
                <tr>
                  <td style="padding: 40px 32px 0;">
                    <!-- Gold corner frame -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid ${COLORS.goldMuted}40;">
                      <!-- Top corners -->
                      <tr>
                        <td style="padding: 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="24" height="24" style="border-top: 2px solid ${COLORS.gold}; border-left: 2px solid ${COLORS.gold};"></td>
                              <td></td>
                              <td width="24" height="24" style="border-top: 2px solid ${COLORS.gold}; border-right: 2px solid ${COLORS.gold};"></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <!-- Album artwork -->
                      <tr>
                        <td style="padding: 8px 16px;">
                          <a href="${siteUrl}/music" target="_blank" style="display: block;">
                            <img src="${siteUrl}/images/releases/InhalingTheEssenceOfAnnihilation.png" alt="Inhaling The Essence of Annihilation" width="100%" style="display: block; border: 0;" />
                          </a>
                        </td>
                      </tr>
                      <!-- Bottom corners -->
                      <tr>
                        <td style="padding: 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="24" height="24" style="border-bottom: 2px solid ${COLORS.gold}; border-left: 2px solid ${COLORS.gold};"></td>
                              <td></td>
                              <td width="24" height="24" style="border-bottom: 2px solid ${COLORS.gold}; border-right: 2px solid ${COLORS.gold};"></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Album info -->
                <tr>
                  <td align="center" style="padding: 20px 32px 0;">
                    <p style="margin: 0; font-size: 11px; color: ${COLORS.textMuted}; letter-spacing: 2px; text-transform: uppercase;">
                      Latest Release
                    </p>
                    <p style="margin: 8px 0 0; font-family: Georgia, 'Times New Roman', serif; font-size: 18px; color: ${COLORS.text};">
                      Inhaling The Essence of Annihilation
                    </p>
                  </td>
                </tr>
                
                <!-- Listen CTA -->
                <tr>
                  <td align="center" style="padding: 24px 32px 40px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border: 1px solid ${COLORS.gold}50; padding: 2px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td align="center" style="background-color: ${COLORS.primary};">
                                <a href="${siteUrl}/music" target="_blank" style="display: inline-block; padding: 14px 36px; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: ${COLORS.text}; text-decoration: none;">
                                  Listen Now
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
          
          <!-- Divider with gold accent -->
          <tr>
            <td style="padding: 0 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.cardBg}; border-left: 1px solid ${COLORS.border}; border-right: 1px solid ${COLORS.border};">
                <tr>
                  <td style="padding: 0 60px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="40%" style="border-bottom: 1px solid ${COLORS.borderLight};"></td>
                        <td width="20%" align="center" style="padding: 0 12px;">
                          <span style="color: ${COLORS.gold}; font-size: 10px;">◆</span>
                        </td>
                        <td width="40%" style="border-bottom: 1px solid ${COLORS.borderLight};"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Benefits Section -->
          <tr>
            <td style="padding: 0 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.cardBg}; border-left: 1px solid ${COLORS.border}; border-right: 1px solid ${COLORS.border};">
                
                <tr>
                  <td style="padding: 40px 40px 24px;">
                    <p style="margin: 0; font-size: 10px; color: ${COLORS.gold}; text-transform: uppercase; letter-spacing: 3px; text-align: center;">
                      What you'll get
                    </p>
                  </td>
                </tr>
                
                <!-- Benefits grid -->
                <tr>
                  <td style="padding: 0 32px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="50%" style="padding: 16px; vertical-align: top; border-bottom: 1px solid ${COLORS.border}; border-right: 1px solid ${COLORS.border};">
                          <p style="margin: 0 0 6px; font-size: 15px; color: ${COLORS.text}; font-weight: 500;">
                            New music first
                          </p>
                          <p style="margin: 0; font-size: 13px; color: ${COLORS.textMuted}; line-height: 1.4;">
                            Hear it before anyone else.
                          </p>
                        </td>
                        <td width="50%" style="padding: 16px; vertical-align: top; border-bottom: 1px solid ${COLORS.border};">
                          <p style="margin: 0 0 6px; font-size: 15px; color: ${COLORS.text}; font-weight: 500;">
                            Tour presales
                          </p>
                          <p style="margin: 0; font-size: 13px; color: ${COLORS.textMuted}; line-height: 1.4;">
                            Early access to tickets.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" style="padding: 16px; vertical-align: top; border-right: 1px solid ${COLORS.border};">
                          <p style="margin: 0 0 6px; font-size: 15px; color: ${COLORS.text}; font-weight: 500;">
                            Limited drops
                          </p>
                          <p style="margin: 0; font-size: 13px; color: ${COLORS.textMuted}; line-height: 1.4;">
                            Subscriber-only merch.
                          </p>
                        </td>
                        <td width="50%" style="padding: 16px; vertical-align: top;">
                          <p style="margin: 0 0 6px; font-size: 15px; color: ${COLORS.text}; font-weight: 500;">
                            Behind the scenes
                          </p>
                          <p style="margin: 0; font-size: 13px; color: ${COLORS.textMuted}; line-height: 1.4;">
                            Studio updates and more.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
          
          <!-- Band Photo Section -->
          <tr>
            <td style="padding: 0 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.cardBg}; border-left: 1px solid ${COLORS.border}; border-right: 1px solid ${COLORS.border};">
                <tr>
                  <td style="padding: 0 32px 40px;">
                    <!-- Gold corner frame for band photo -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid ${COLORS.goldMuted}30;">
                      <tr>
                        <td style="padding: 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="16" height="16" style="border-top: 1px solid ${COLORS.gold}; border-left: 1px solid ${COLORS.gold};"></td>
                              <td></td>
                              <td width="16" height="16" style="border-top: 1px solid ${COLORS.gold}; border-right: 1px solid ${COLORS.gold};"></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 8px;">
                          <img src="${siteUrl}/images/photos/OfBloodBandPhoto.png" alt="Of Blood" width="100%" style="display: block; border: 0;" />
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="16" height="16" style="border-bottom: 1px solid ${COLORS.gold}; border-left: 1px solid ${COLORS.gold};"></td>
                              <td></td>
                              <td width="16" height="16" style="border-bottom: 1px solid ${COLORS.gold}; border-right: 1px solid ${COLORS.gold};"></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer Section -->
          <tr>
            <td style="padding: 0 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: ${COLORS.cardBg}; border-left: 1px solid ${COLORS.border}; border-right: 1px solid ${COLORS.border};">
                
                <!-- Signature -->
                <tr>
                  <td align="center" style="padding: 8px 40px 32px;">
                    <img src="${siteUrl}/images/logos/OfBloodLogo.png" alt="Of Blood" width="140" style="display: block; border: 0;" />
                  </td>
                </tr>
                
                <!-- Social links -->
                <tr>
                  <td align="center" style="padding: 0 40px 32px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 0 14px;">
                          <a href="https://instagram.com/ofbloodband" target="_blank" style="color: ${COLORS.textMuted}; text-decoration: none; font-size: 11px; letter-spacing: 1px;">Instagram</a>
                        </td>
                        <td style="color: ${COLORS.borderLight};">·</td>
                        <td style="padding: 0 14px;">
                          <a href="https://tiktok.com/@ofbloodband" target="_blank" style="color: ${COLORS.textMuted}; text-decoration: none; font-size: 11px; letter-spacing: 1px;">TikTok</a>
                        </td>
                        <td style="color: ${COLORS.borderLight};">·</td>
                        <td style="padding: 0 14px;">
                          <a href="https://youtube.com/@OfBloodBand" target="_blank" style="color: ${COLORS.textMuted}; text-decoration: none; font-size: 11px; letter-spacing: 1px;">YouTube</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Website -->
                <tr>
                  <td align="center" style="padding: 0 40px 32px;">
                    <a href="${siteUrl}" target="_blank" style="color: ${COLORS.gold}; text-decoration: none; font-size: 12px; letter-spacing: 2px;">
                      of-blood.com
                    </a>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
          
          <!-- Bottom gold bar -->
          <tr>
            <td style="padding: 0 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td height="2" style="background: linear-gradient(90deg, transparent 0%, ${COLORS.gold}50 15%, ${COLORS.gold} 50%, ${COLORS.gold}50 85%, transparent 100%);"></td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Legal footer -->
          <tr>
            <td style="padding: 24px 24px 40px; text-align: center;">
              <p style="margin: 0; font-size: 10px; color: ${COLORS.textMuted}; line-height: 1.8;">
                You signed up for the Of Blood newsletter.<br>
                <a href="${siteUrl}" style="color: ${COLORS.textMuted}; text-decoration: underline;">Unsubscribe</a>
              </p>
              <p style="margin: 12px 0 0; font-size: 9px; color: ${COLORS.border}; letter-spacing: 0.5px;">
                © ${new Date().getFullYear()} Of Blood
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
  `.trim();
}

/**
 * Plain text version of the welcome email (for better deliverability)
 */
export function getWelcomeEmailText({ isResubscribe = false, siteUrl = 'https://of-blood.com' }: WelcomeEmailProps = {}): string {
  const heading = isResubscribe 
    ? "You're already on the list."
    : "You're in.";

  return `
OF BLOOD
────────────────────────────────────────

${heading}

Thanks for joining the Of Blood newsletter.

────────────────────────────────────────

WHAT YOU'LL GET

New music first
Hear releases before they go public.

Tour presales
Early access to tickets and VIP packages.

Limited merch drops
Exclusive items only available to subscribers.

Behind the scenes
Studio updates, stories, and more.

────────────────────────────────────────

Listen now: ${siteUrl}/music

────────────────────────────────────────

Instagram: https://instagram.com/ofbloodband
TikTok: https://tiktok.com/@ofbloodband  
YouTube: https://youtube.com/@OfBloodBand

${siteUrl}

────────────────────────────────────────

You signed up for the Of Blood newsletter.
Unsubscribe: ${siteUrl}

© ${new Date().getFullYear()} Of Blood

Tip: Move this to Primary and add newsletter@of-blood.com 
to your contacts so you don't miss updates.
  `.trim();
}

