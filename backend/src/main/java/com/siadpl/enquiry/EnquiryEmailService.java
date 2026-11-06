package com.siadpl.enquiry;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EnquiryEmailService {
  private final JavaMailSender mailSender;
  private final String recipient;
  private final String host;

  public EnquiryEmailService(JavaMailSender mailSender,
                             @Value("${app.enquiry.recipient:sinhainfrastructure.siadpl@gmail.com}") String recipient,
                             @Value("${spring.mail.host:}") String host) {
    this.mailSender = mailSender;
    this.recipient = recipient;
    this.host = host;
  }

  public boolean isConfigured() {
    return host != null && !host.isBlank();
  }

  public void sendEnquiryNotification(EnquiryRequest enquiry) {
    if (!isConfigured()) {
      return;
    }
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
      helper.setTo(recipient);
      helper.setReplyTo(enquiry.email());
      helper.setSubject("New enquiry: " + enquiry.subject());
      helper.setText("""
          New enquiry received from the SIADPL website.

          Name: %s
          Email: %s
          Phone: %s
          Subject: %s

          Message:
          %s
          """.formatted(enquiry.name(), enquiry.email(), enquiry.phone(), enquiry.subject(), enquiry.message()));
      mailSender.send(message);
    } catch (Exception ex) {
      // Do not fail the enquiry request only because email delivery failed.
      System.err.printf("Could not send enquiry email: %s%n", ex.getMessage());
    }
  }
}