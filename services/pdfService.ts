import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FormalQuoteRequest, OPTIONAL_COVERS } from "../types";

// Placeholder for Arabic Font (Amiri-Regular or Cairo-Regular).
// You must replace this empty string with the actual Base64 encoded TTF file content.
// Example: "AAEAAAASAQAABAAgDR..."
const ARABIC_FONT_BASE64 = "";

export const pdfService = {
    /**
     * Generates the PDF designed for the Final Customer.
     * Focuses on branding, clarity, and benefits.
     */
    generateCustomerPdf: (req: FormalQuoteRequest) => {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        // Register Arabic Font if available
        if (ARABIC_FONT_BASE64) {
            doc.addFileToVFS("Amiri-Regular.ttf", ARABIC_FONT_BASE64);
            doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
            doc.setFont("Amiri");
        }

        const { customer, quoteRequest, quoteResult, submittedAt } = req;

        // 1. Header (Pomegranate Aesthetic)
        doc.setFillColor(190, 18, 60); // Pomegranate Red
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Rommaana Home Insurance", 15, 18);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Your Personalized Home Insurance Offer", 15, 28);
        doc.text("In collaboration with Al Etihad Cooperative Insurance Co.", 15, 33);

        // 2. Reference & Date
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(9);
        doc.text(`REFERENCE ID: ${quoteResult.referenceId}`, 15, 50);
        doc.text(`OFFER DATE: ${new Date(submittedAt).toLocaleDateString()}`, 15, 55);

        // 3. Customer Info Box
        doc.setFillColor(248, 250, 252); // Very light slate
        doc.rect(10, 65, 190, 45, 'F');
        doc.setFont("helvetica", "bold");
        doc.setTextColor(190, 18, 60);
        doc.text("CUSTOMER DETAILS", 15, 72);

        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`${customer.firstName} ${customer.lastName}`, 15, 80);
        doc.text(`ID: ${customer.nationalId}`, 15, 85);
        doc.text(`Phone: ${customer.phone}`, 15, 90);
        doc.text(`Email: ${customer.email}`, 110, 80);
        doc.text(`City: ${customer.city}`, 110, 85);
        doc.text(`Neighborhood: ${customer.neighborhood}`, 110, 90);

        // 4. Policy Summary
        doc.setFont("helvetica", "bold");
        doc.text("POLICY OVERVIEW", 15, 120);
        doc.setFont("helvetica", "normal");

        const overviewData = [
            ["Type", quoteRequest.userType === 'OWNER' ? 'Home Owner' : 'Tenant'],
            ["Duration", `${quoteRequest.durationYears} Year(s)`],
            ["Domestic Workers", quoteRequest.domesticWorkersCount === 0 ? 'None' : quoteRequest.domesticWorkersCount.toString()],
            ["Scheme", quoteResult.schemeName],
            ["Start Date", quoteRequest.startDate]
        ];

        autoTable(doc, {
            body: overviewData,
            startY: 125,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 2 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } },
            margin: { left: 15 }
        });

        // 5. Main Coverage Table
        const coverageData = [
            ["Coverage Category", "Limit (SAR)"],
            ["Building (Structure)", quoteRequest.userType === 'OWNER' ? quoteRequest.buildingValue.toLocaleString() : "Not Applicable"],
            ["Home Contents", quoteRequest.contentsValue.toLocaleString()],
            ["Public Liability", quoteResult.details.publicLiability.toLocaleString()],
            ["Domestic Staff Liability", quoteResult.details.domesticStaff.toLocaleString()],
            ["Personal Accident", quoteResult.details.paOwner.toLocaleString()],
        ];

        autoTable(doc, {
            head: [coverageData[0]],
            body: coverageData.slice(1),
            startY: 155,
            theme: 'striped',
            headStyles: { fillColor: [190, 18, 60] },
            styles: { fontSize: 9 },
            margin: { left: 15, right: 15 }
        });

        // 6. Final Price
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFillColor(254, 243, 199); // Gold-100
        doc.rect(120, finalY, 75, 25, 'F');
        doc.setFont("helvetica", "bold");
        doc.setTextColor(146, 64, 14); // Gold-800
        doc.text("TOTAL PREMIUM", 125, finalY + 10);
        doc.setFontSize(16);
        doc.text(`SAR ${quoteResult.totalPremium.toLocaleString()}`, 125, finalY + 20);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Thank you for choosing Rommaana. This document is a quote and not yet a binding policy.", 105, 285, { align: 'center' });

        doc.save(`Rommaana_Offer_${quoteResult.referenceId}.pdf`);
    },

    /**
     * Generates the PDF designed for Al Etihad Issuance.
     * Focuses on technical data and policy parameters.
     */
    generateIssuancePdf: (req: FormalQuoteRequest) => {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        // Register Arabic Font if available
        if (ARABIC_FONT_BASE64) {
            doc.addFileToVFS("Amiri-Regular.ttf", ARABIC_FONT_BASE64);
            doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
            doc.setFont("Amiri");
        }

        const { customer, quoteRequest, quoteResult } = req;

        // 1. Technical Header
        doc.setFillColor(51, 65, 85); // Slate-700
        doc.rect(0, 0, 210, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("POLICY ISSUANCE REQUEST", 15, 15);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`REQUEST ID: ${quoteResult.referenceId} | ROMMAANA B2B`, 15, 23);

        // 2. Section 1: End-User Profile
        let currentY = 45;
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("SECTION 1: CUSTOMER DATA", 15, currentY);
        doc.line(15, currentY + 1, 195, currentY + 1);

        const customerData = [
            ["Full Name", `${customer.firstName} ${customer.lastName}`],
            ["National ID / Iqama", customer.nationalId],
            ["Date of Birth", customer.dob],
            ["Phone", customer.phone],
            ["Email", customer.email],
            ["City / Region", `${customer.city} / ${customer.neighborhood}`],
            ["Strict Address", `${customer.streetAddress}, ${customer.streetNumber}`],
            ["Unit Details", `Apt ${customer.apartment}, Floor ${customer.floor}`]
        ];

        autoTable(doc, {
            body: customerData,
            startY: currentY + 5,
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 45, fillColor: [245, 245, 245] } },
            margin: { left: 15 }
        });

        // 3. Section 2: Technical Parameters
        currentY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFont("helvetica", "bold");
        doc.text("SECTION 2: POLICY PARAMETERS", 15, currentY);
        doc.line(15, currentY + 1, 195, currentY + 1);

        const paramsData = [
            ["Product Type", "Home Insurance"],
            ["Sub-Product", quoteRequest.userType === 'OWNER' ? 'Owner Policy' : 'Tenant Policy'],
            ["B2B Partner", "Rommaana Partner"],
            ["Duration (Years)", quoteRequest.durationYears.toString()],
            ["Effective Date", quoteRequest.startDate],
            ["Selected Scheme", quoteResult.schemeName],
            ["Domestic Workers", quoteRequest.domesticWorkersCount.toString()]
        ];

        autoTable(doc, {
            body: paramsData,
            startY: currentY + 5,
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 45, fillColor: [245, 245, 245] } },
            margin: { left: 15 }
        });

        // 4. Section 3: Limits & Declarations
        currentY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFont("helvetica", "bold");
        doc.text("SECTION 3: LIMITS & VALUES", 15, currentY);
        doc.line(15, currentY + 1, 195, currentY + 1);

        const limitsData = [
            ["Building Limit", `SAR ${quoteRequest.buildingValue.toLocaleString()}`],
            ["Contents Limit", `SAR ${quoteRequest.contentsValue.toLocaleString()}`],
            ["Public Liability", `SAR ${quoteResult.details.publicLiability.toLocaleString()}`]
        ];

        // Add optional covers if any
        if (quoteRequest.selectedOptions && quoteRequest.selectedOptions.length > 0) {
            quoteRequest.selectedOptions.forEach(opt => {
                limitsData.push([
                    `Add-on: ${OPTIONAL_COVERS[opt]}`,
                    `Value: SAR ${(quoteRequest.optionalCoverageValues?.[opt] || 0).toLocaleString()}`
                ]);
            });
        }

        autoTable(doc, {
            body: limitsData,
            startY: currentY + 5,
            theme: 'grid',
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 45, fillColor: [245, 245, 245] } },
            margin: { left: 15 }
        });

        // 5. Section 4: Premium Summary (Technical)
        currentY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFont("helvetica", "bold");
        doc.text("SECTION 4: PREMIUM BREAKDOWN", 15, currentY);
        doc.line(15, currentY + 1, 195, currentY + 1);

        const premiumData = [
            ["Net Premium", `SAR ${quoteResult.netPremium.toLocaleString()}`],
            ["VAT (5%)", `SAR ${quoteResult.vat.toLocaleString()}`],
            ["Total Gross Premium", `SAR ${quoteResult.totalPremium.toLocaleString()}`]
        ];

        autoTable(doc, {
            body: premiumData,
            startY: currentY + 5,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 45, fillColor: [245, 245, 245] },
                1: { fontStyle: 'bold' }
            },
            margin: { left: 15 }
        });

        // Stamp Space
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Authorized by Rommaana Digital Insurance Platform", 15, 270);
        doc.rect(150, 250, 40, 30); // Placeholder for stamp
        doc.text("ETIHAD USE ONLY", 170, 255, { align: 'center' });

        doc.save(`Issuance_Request_${quoteResult.referenceId}.pdf`);
    }
};
