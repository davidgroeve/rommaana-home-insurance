# System Architecture & Workflows

## 1. Premium Calculation Logic

The premium calculation is the core of the rating engine. It determines the cost of the insurance policy based on user inputs and risk parameters. The logic is encapsulated in `services/calculationService.ts`.

### Input Parameters
The calculation relies on the following inputs from the `QuoteRequest`:
- **User Type**: Homeowner or Tenant.
- **Coverage Limits**: Building Value (Structure) and Contents Value.
- **Duration**: Policy length in years.
- **Add-ons**: Selected optional covers (e.g., Paintings, Emergency Purchase).
- **Domestic Workers**: Number of household staff to insure.

### Calculation Algorithm

1.  **Scheme Selection (Underwriting)**
    The system checks the requested Building and Contents values against defined tiers (Schemes A, B, C, D). It automatically selects the lowest tier that accommodates the requested limits.
    - *Constraint:* If values exceed the maximum limits of Scheme D, the system rejects the auto-quote and requests manual support.

2.  **Base Premium Determination**
    Once a Scheme is identified, the **Base Premium** is retrieved from a lookup table based on the `UserType` (Owner vs. Tenant).

3.  **Optional Converages Loading**
    Each selected optional cover adds a surcharge to the premium.
    - **Logic**: `Surcharge = Base Premium * 20%` (per option).
    - **Total Options Cost**: `Surcharge * Number of Options`.

4.  **Domestic Worker Endorsement**
    - The first worker is typically included or covered by the base.
    - **Additional Workers**: Charged at a flat rate of **50 SAR** per worker (for workers > 1).

5.  **Net Premium Calculation**
    The annual net premium is calculated as:
    ```
    (Base Premium + Total Options Cost + Domestic Worker Surcharge) * Duration Years
    ```
    *Note: Currently, there is no discount applied for multi-year policies; it is a linear multiplication.*

6.  **Final Pricing (Gross)**
    - **VAT**: Applied at 15% (standard regulatory rate) on the Net Premium.
    - **Total**: Net Premium + VAT.

---

## 2. B2B Partner Integration (APIs)

Rommaana enables B2B partnerships (e.g., Real Estate agencies, Banks) to issue policies on behalf of their customers. This is managed via the **Admin Dashboard** and secured via API Keys.

### Partner Onboarding & Management
- **Dashboard**: Administrators can view and manage partners in the `Partners` tab of the Admin Dashboard.
- **Key Generation**:
    - Admins generate unique **API Secrets** (starting with `rh_`) for new partners.
    - These keys are stored securely in Supabase (`api_keys` table).
    - *Security Note*: The secret is shown only once upon generation.

### API Interconnection
Partners use their API Key to authenticate requests against the Rommmana API.
- **Flow**:
    1. Partner system sends a Quote Request payload signed with their `rh_` key.
    2. Rommaana validates the key and "Created By" attribution.
    3. The standard Premium Calculation logic (described above) is executed.
    4. A quote is returned to the Partner's system.
    5. If accepted, the Partner triggers the `Bind/Issue` endpoint to finalize the policy.

---

## 3. PDF Submission & Al Etihad Issuance

Rommaana acts as the digital front-end, while **Al Etihad Cooperative Insurance Co.** is the risk carrier. The "submission" process involves generating regulatory documents and transmitting them for binding.

### PDF Generation (`pdfService.ts`)
The system dynamically generates two distinct PDF documents using `jspdf`:

1.  **Customer Offer (The "Marketing" Doc)**
    - **Audience**: The End User.
    - **Design**: Branded with Rommaana colors (Pomegranate), friendly layout, focuses on benefits and clarity.
    - **Content**: Summary of coverages, total price, and "Thank You" note.

2.  **Issuance Request (The "Technical" Doc)**
    - **Audience**: Al Etihad Underwriters / Operations.
    - **Design**: Strict, technical, slate-grey styling.
    - **Content**:
        - **Section 1**: Full Customer KYB (National ID, Strict Address, Unit Details).
        - **Section 2**: Policy Parameters (Effective dates, Scheme codes).
        - **Section 3**: Limits Breakdown (Specific sums insured for Building/Contents).
        - **Section 4**: Premium Breakdown (Net vs VAT split).

### Submission Workflow
Currently, the submission process is handled manually via the **Admin Dashboard**:

1.  **Queue**: All "Pending" quote requests appear in the Issuance tab.
2.  **Action**: The Admin reviews the request and clicks **"Send Documents"**.
3.  **Routing**:
    - The system invokes `emailService.sendQuoteDocuments`.
    - Both PDFs (Customer + Issuance) are attached.
    - **Destination**: The email is routed to the operational inbox (currently configured as `gestion@lovepomegranate.com` for development/testing).
4.  **Status**: The request status is updated to `CONTACTED` in the database, indicating the carrier has been notified to bind the policy.
