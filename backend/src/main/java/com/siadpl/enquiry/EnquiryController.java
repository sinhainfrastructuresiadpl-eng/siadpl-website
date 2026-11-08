package com.siadpl.enquiry;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {
  private final EnquiryRepository repository;
  private final String exportKey;

  public EnquiryController(EnquiryRepository repository,
                          @Value("${app.enquiry.export-key:}") String exportKey) {
    this.repository = repository;
    this.exportKey = exportKey;
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
    System.out.printf("New enquiry #%d received%n", saved.getId());
    return Map.of("message", "Enquiry received", "detail", "Enquiry saved.", "id", saved.getId(), "receivedAt", Instant.now().toString());
  }

  @GetMapping("/export")
  public ResponseEntity<String> export(@RequestHeader(value = "X-Export-Key", required = false) String suppliedKey) {
    if (exportKey == null || exportKey.isBlank() || !exportKey.equals(suppliedKey)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }

    StringBuilder csv = new StringBuilder();
    csv.append("id,createdAt,name,email,phone,subject,message\n");
    for (Enquiry enquiry : repository.findAll()) {
      csv.append(enquiry.getId()).append(',')
          .append(csvValue(enquiry.getCreatedAt() == null ? "" : enquiry.getCreatedAt().toString())).append(',')
          .append(csvValue(enquiry.getName())).append(',')
          .append(csvValue(enquiry.getEmail())).append(',')
          .append(csvValue(enquiry.getPhone())).append(',')
          .append(csvValue(enquiry.getSubject())).append(',')
          .append(csvValue(enquiry.getMessage())).append('\n');
    }

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.parseMediaType("text/csv; charset=UTF-8"));
    headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"enquiries.csv\"");
    return ResponseEntity.ok().headers(headers).body(csv.toString());
  }

  private static String csvValue(String value) {
    if (value == null) {
      return "\"\"";
    }
    String escaped = value.replace("\"", "\"\"");
    return "\"" + escaped.replace("\n", " ").replace("\r", " ") + "\"";
  }
}
