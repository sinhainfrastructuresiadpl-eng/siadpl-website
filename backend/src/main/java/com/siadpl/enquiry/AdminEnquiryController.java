package com.siadpl.enquiry;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminEnquiryController {
  private final EnquiryRepository repository;
  private final String adminEmail;
  private final String adminPassword;

  public AdminEnquiryController(EnquiryRepository repository,
                                @Value("${app.admin.email:sinhainfrastructure.siadpl@gmail.com}") String adminEmail,
                                @Value("${app.admin.password:}") String adminPassword) {
    this.repository = repository;
    this.adminEmail = adminEmail;
    this.adminPassword = adminPassword;
  }

  @GetMapping("/enquiries")
  public ResponseEntity<?> enquiries(@RequestHeader(value = "Authorization", required = false) String authorization) {
    if (!isAuthorized(authorization)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .header(HttpHeaders.WWW_AUTHENTICATE, "Basic realm=\"SIADPL Admin\"")
          .body("Unauthorized");
    }
    List<Enquiry> enquiries = repository.findAll();
    return ResponseEntity.ok(enquiries);
  }

  private boolean isAuthorized(String authorization) {
    if (authorization == null || !authorization.startsWith("Basic ")) {
      return false;
    }
    try {
      String decoded = new String(Base64.getDecoder().decode(authorization.substring(6)), StandardCharsets.UTF_8);
      int separator = decoded.indexOf(':');
      if (separator < 0) {
        return false;
      }
      String username = decoded.substring(0, separator);
      String password = decoded.substring(separator + 1);
      return adminEmail.equals(username) && adminPassword.equals(password);
    } catch (IllegalArgumentException ex) {
      return false;
    }
  }
}
