using Bidwise.Identity.Options;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using MimeKit;
using System.Net;
using System.Net.Mail;

namespace Bidwise.Identity.Services;

public class EmailSender : IEmailSender
{
    private readonly ILogger _logger;
    private readonly AuthMessageSenderOptions _authMessageSenderOptions;

    public EmailSender(IOptions<AuthMessageSenderOptions> optionsAccessor,
                       ILogger<EmailSender> logger)
    {
        _authMessageSenderOptions = optionsAccessor.Value;
        _logger = logger;
    }


    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        try
        {
            var mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(_authMessageSenderOptions.Mail, _authMessageSenderOptions.DisplayName);
            mailMessage.To.Add(new MailAddress(toEmail, toEmail));
            mailMessage.Subject = subject;
            mailMessage.Body = message;

            mailMessage.IsBodyHtml = true;
            mailMessage.Priority = MailPriority.High;

            using var client = new SmtpClient();

            client.Host = _authMessageSenderOptions.Host;
            client.Port = _authMessageSenderOptions.Port;
            client.EnableSsl = true;
            client.Credentials = new NetworkCredential(_authMessageSenderOptions.Mail, _authMessageSenderOptions.Password);
            await client.SendMailAsync(mailMessage);

            _logger.LogInformation($"Email to {toEmail} queued successfully!");
        }
        catch
        {
            _logger.LogError($"Failure Email to {toEmail}");
        }
    }
}
