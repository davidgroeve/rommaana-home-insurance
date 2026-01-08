# Rommaana Home Insurance

<div align="center">
  <!-- You can add a logo here if available -->
  <!-- <img src="logo.png" alt="Rommaana Logo" width="200" /> -->
</div>

## Purpose
**Rommaana Home Insurance** is a digital platform designed to provide instant home insurance quotes for **Owners** and **Tenants** in Saudi Arabia. It acts as a bridge between customers and the insurance carrier, **Al Etihad Cooperative Insurance Co.**, simplifying the complex pricing and data collection process required for policy issuance.

## Key Functionalities
The application offers the following core capabilities:

- **Quote Engine**: Instantly calculates premiums based on user inputs (Building Value, Contents Value, User Type) using pre-defined local pricing rules (`calculationService.ts`).
- **Scheme Selection**: Automatically matches users to the correct insurance scheme (e.g., limits for building/contents) based on their coverage needs.
- **User Management**: Supports Role-Based Access Control (RBAC) for **Customers** (view quotes/policies) and **Admins** (manage requests/partners).
- **B2B Integration**: Provides an infrastructure for B2B partners to integrate and submit quotes via API keys.
- **Request Management**: A full workflow for submitting formal "Policy Issuance Requests" to the insurer.

## API & B2B Partner Connectivity
The application is built with a B2B-first mindset, allowing partners to integrate via secure API Keys.

### Implementation Details
- **Location**: [`services/api.ts`](./services/api.ts) -> `b2b` object
- **Submission Endpoint**: `quotes.submit` - The central API point where B2B partners send customer data to initiate a policy.

### Key Features
1. **Key Generation** (`generateKey`): 
   - Admins can generate unique API keys for new partners (e.g., Real Estate platforms, Banks).
2. **Authentication**: 
   - Uses Supabase Auth to track which partner is making a request.
3. **Infrastructure**: 
   - The `api_keys` table in Supabase links requests to specific partners for commission/tracking.

## PDF Generation System
The application handles document generation on the client-side using `jspdf` and `jspdf-autotable`, ensuring data privacy and speed.

### 1. Final Customer Quote
**Function**: `pdfService.generateCustomerPdf(req)`

A marketing-friendly, aesthetically pleasing document for the end-user.
- **Branding**: Uses "Pomegranate Red" branding and Rommaana logos.
- **Summary**: Simplified coverage limits (Building, Contents).
- **Pricing**: Clear Total Premium display.
- **Disclaimer**: Clearly states *"This document is a quote and not yet a binding policy."*

### 2. Al Etihad Policy Issuance Request
**Function**: `pdfService.generateIssuancePdf(req)`

A technical, structured document specifically for the underwriter (Al Etihad) to issue the formal policy.
- **Technical Headers**: "POLICY ISSUANCE REQUEST" | "ROMMAANA B2B".
- **Section 1 (Customer Data)**: Strict data fields required for KYC (National ID, DOB, Detailed National Address).
- **Section 2 (Parameters)**: Product codes, Scheme names, and Effective dates.
- **Section 3 (Limits)**: Precise liability limits and optional cover breakdowns (e.g., Jewellery values).
- **Section 4 (Premium)**: Detailed tax breakdown (Net Premium + VAT = Gross) required for accounting.

---
## Summary
The codebase is a modern **React/Vite** application that serves as a highly specialized frontend for selling Home Insurance. It abstracts the complexity of insurance pricing into a simple UI for customers while maintaining the rigorous data standards required by the insurer (**Al Etihad**) for the actual binding of policies.