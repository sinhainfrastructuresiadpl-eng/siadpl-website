package com.siadpl.enquiry;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EnquiryRequest(
    @NotBlank(message = "Name is required") String name,
    @NotBlank @Email(message = "A valid email is required") String email,
    @NotBlank(message = "Phone is required") String phone,
    @NotBlank(message = "Subject is required") String subject,
    @NotBlank(message = "Message is required") String message) { }
