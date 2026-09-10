package com.siadpl.enquiry;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = "http://localhost:5173")
public class EnquiryController {
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> create(@Valid @RequestBody EnquiryRequest enquiry) {
    // Replace this with database persistence and email notification when those services are selected.
    System.out.printf("New enquiry from %s <%s>: %s%n", enquiry.name(), enquiry.email(), enquiry.subject());
    return Map.of("message", "Enquiry received", "receivedAt", Instant.now().toString());
  }
}
