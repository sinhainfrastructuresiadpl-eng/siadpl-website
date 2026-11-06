package com.siadpl.enquiry;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "enquiries")
public class Enquiry {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 120)
  private String name;

  @Column(nullable = false, length = 254)
  private String email;

  @Column(nullable = false, length = 40)
  private String phone;

  @Column(nullable = false, length = 120)
  private String subject;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String message;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;

  protected Enquiry() {
  }

  public Enquiry(String name, String email, String phone, String subject, String message) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.subject = subject;
    this.message = message;
  }

  @PrePersist
  void onCreate() {
    this.createdAt = Instant.now();
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public String getPhone() {
    return phone;
  }

  public String getSubject() {
    return subject;
  }

  public String getMessage() {
    return message;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }
}