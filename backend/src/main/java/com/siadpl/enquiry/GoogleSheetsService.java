package com.siadpl.enquiry;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Instant;
import java.util.List;

@Service
public class GoogleSheetsService {
  private static final String SCOPE = "https://www.googleapis.com/auth/spreadsheets";
  private static final String SHEETS_BASE = "https://sheets.googleapis.com/v4/spreadsheets/";

  private final boolean enabled;
  private final String spreadsheetId;
  private final String sheetName;
  private final String credentialsPath;
  private final HttpClient httpClient = HttpClient.newHttpClient();

  public GoogleSheetsService(
      @Value("${app.google.sheets.enabled:false}") boolean enabled,
      @Value("${app.google.sheets.spreadsheet-id:}") String spreadsheetId,
      @Value("${app.google.sheets.sheet-name:Enquiries}") String sheetName,
      @Value("${app.google.sheets.credentials-path:}") String credentialsPath) {
    this.enabled = enabled;
    this.spreadsheetId = spreadsheetId;
    this.sheetName = sheetName;
    this.credentialsPath = credentialsPath;
  }

  public boolean isConfigured() {
    return enabled
        && spreadsheetId != null
        && !spreadsheetId.isBlank()
        && (credentialsPath != null && !credentialsPath.isBlank()
        || System.getenv("GOOGLE_APPLICATION_CREDENTIALS") != null);
  }

  public void appendEnquiry(EnquiryRequest enquiry) {
    if (!isConfigured()) {
      return;
    }
    try {
      GoogleCredentials credentials;
      if (credentialsPath != null && !credentialsPath.isBlank()) {
        try (FileInputStream stream = new FileInputStream(credentialsPath)) {
          credentials = ServiceAccountCredentials.fromStream(stream);
        }
      } else {
        credentials = GoogleCredentials.getApplicationDefault();
      }
      credentials = credentials.createScoped(List.of(SCOPE));
      credentials.refreshIfExpired();
      String accessToken = credentials.getAccessToken().getTokenValue();

      String timestamp = Instant.now().toString();
      String body = "{\"values\":[[" +
          json(timestamp) + "," +
          json(enquiry.name()) + "," +
          json(enquiry.email()) + "," +
          json(enquiry.phone()) + "," +
          json(enquiry.subject()) + "," +
          json(enquiry.message()) +
          "]]}";

      String uri = SHEETS_BASE + encode(spreadsheetId) + "/values/" + encode(sheetName) + "!A1:append?valueInputOption=USER_ENTERED";
      HttpRequest request = HttpRequest.newBuilder(URI.create(uri))
          .header("Authorization", "Bearer " + accessToken)
          .header("Content-Type", "application/json")
          .POST(HttpRequest.BodyPublishers.ofString(body))
          .build();

      HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
      if (response.statusCode() < 200 || response.statusCode() >= 300) {
        System.err.printf("Google Sheets append failed: %d %s%n", response.statusCode(), response.body());
      }
    } catch (Exception ex) {
      System.err.printf("Could not append enquiry to Google Sheets: %s%n", ex.getMessage());
    }
  }

  private static String encode(String value) {
    return java.net.URLEncoder.encode(value, java.nio.charset.StandardCharsets.UTF_8);
  }

  private static String json(String value) {
    if (value == null) {
      return "\"\"";
    }
    return "\"" + value
        .replace("\\", "\\\\")
        .replace("\"", "\\\"")
        .replace("\n", "\\n")
        .replace("\r", "\\r")
        .replace("\t", "\\t")
        + "\"";
  }
}