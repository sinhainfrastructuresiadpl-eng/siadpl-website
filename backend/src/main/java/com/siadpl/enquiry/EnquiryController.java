package com.siadpl.enquiry;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {
  private final EnquiryRepository repository;
  private final EnquiryEmailService emailService;
  private final GoogleSheetsService sheetsService;

  public EnquiryController(EnquiryRepository repository, EnquiryEmailService emailService, GoogleSheetsService sheetsService) {
    this.repository = repository;
    this.emailService = emailService;
    this.sheetsService = sheetsService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> create(@Valid @RequestBody EnquiryRequest enquiry) {
    Enquiry saved = repository.save(new Enquiry(
        enquiry.name(),
        enquiry.email(),
        enquiry.phone(),
        enquiry.subject(),
        enquiry.message()));
    System.out.printf("New enquiry #%d from %s <%s>: %s%n", saved.getId(), enquiry.name(), enquiry.email(), enquiry.subject());
    emailService.sendEnquiryNotification(enquiry);
    sheetsService.appendEnquiry(enquiry);
    String note = emailService.isConfigured()
        ? "Enquiry saved and notification email sent."
        : "Enquiry saved. Email notification is not configured.";
    if (sheetsService.isConfigured()) {
      note += " Enquiry appended to Google Sheets.";
    }
    return Map.of("message", "Enquiry received", "detail", note, "id", saved.getId(), "receivedAt", Instant.now().toString());
  }
}