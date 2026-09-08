"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Circle, AlertCircle, Download } from "lucide-react";
import type { Business } from "@/types";

interface ProfileReadinessProps {
  business: Business;
}

interface ChecklistItem {
  label: string;
  key: "name" | "category" | "description" | "contact" | "pricing";
  complete: boolean;
}

export function getBusinessCompletionState(business: Business) {
  const checklist: ChecklistItem[] = [
    {
      label: "Name",
      key: "name",
      complete: !!(business.name && business.name.trim().length > 0),
    },
    {
      label: "Category",
      key: "category",
      complete: !!(business.category && business.category.trim().length > 0),
    },
    {
      label: "Description",
      key: "description",
      complete: !!(business.description && business.description.trim().length > 0),
    },
    {
      label: "Contact",
      key: "contact",
      complete: !!(business.email || business.phone || business.website),
    },
    {
      label: "Pricing",
      key: "pricing",
      complete: !!business.pricing,
    },
  ];

  const completedCount = checklist.filter((item) => item.complete).length;
  const percentage = Math.round((completedCount / checklist.length) * 100);
  const missingFields = checklist.filter((item) => !item.complete).map((item) => item.label);

  return {
    checklist,
    completedCount,
    totalCount: checklist.length,
    percentage,
    isComplete: completedCount === checklist.length,
    missingFields,
  };
}

export function generateBusinessReport(business: Business) {
  const completionState = getBusinessCompletionState(business);
  const contactValue = [business.email, business.phone, business.website].filter(Boolean).join(" | ") || "Not provided";
  const pricingValue = business.pricing
    ? `${business.pricing.currency} ${business.pricing.priceRange} (Min order: ${business.pricing.minOrder})`
    : "Not provided";
  const tagsValue = business.tags && business.tags.length > 0 ? business.tags.join(", ") : "Not provided";
  const sectionValue = business.section || "Not provided";
  const missingValue = completionState.missingFields.length > 0 ? completionState.missingFields.join(", ") : "None";
  const statusSummary = completionState.isComplete
    ? "100% Complete\nProfile ready"
    : `${completionState.percentage}% Complete\n${completionState.missingFields.length} field(s) missing`;

  const checklistMarkup = completionState.checklist
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 10px; border-bottom: 1px solid #e7efe8; font-weight: 600; color: #173f35;">${item.complete ? "✓" : "○"} ${item.label}</td>
          <td style="padding: 8px 10px; border-bottom: 1px solid #e7efe8; color: #2d4a3c;">${item.complete ? "Complete" : "Missing"}</td>
        </tr>
      `,
    )
    .join("");

  const filename = `${business.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "business"}-report.html`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${business.name} | BizLink AI Report</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; background: #f6f3ee; color: #173f35; }
      .container { max-width: 820px; margin: 32px auto; background: #ffffff; border: 1px solid #dfe8e2; border-radius: 18px; padding: 32px; }
      .header { border-bottom: 1px solid #dfe8e2; padding-bottom: 18px; margin-bottom: 24px; }
      .eyebrow { letter-spacing: 0.18em; text-transform: uppercase; font-size: 11px; color: #577a6e; }
      h1 { margin: 10px 0 8px; font-size: 32px; color: #173f35; }
      .subhead { color: #45655d; font-size: 14px; }
      .status-box { background: #edf5f0; border: 1px solid #d8eae1; border-radius: 12px; padding: 16px; margin: 18px 0 28px; }
      .status-box strong { display: block; font-size: 18px; margin-bottom: 4px; }
      .section { margin-top: 24px; }
      .section h2 { font-size: 18px; margin: 0 0 12px; color: #173f35; }
      table { width: 100%; border-collapse: collapse; background: #fbfbf9; border: 1px solid #e7efe8; border-radius: 12px; overflow: hidden; }
      th, td { text-align: left; vertical-align: top; }
      .label { font-weight: 700; color: #173f35; width: 150px; }
      .meta { color: #45655d; }
      .footer { margin-top: 28px; padding-top: 18px; border-top: 1px solid #dfe8e2; font-size: 12px; color: #577a6e; }
      @media print { body { background: #fff; } .container { box-shadow: none; border: none; margin: 0; max-width: 100%; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="eyebrow">BizLink AI</div>
        <h1>Business Profile Report</h1>
        <div class="subhead">${business.name} · ${business.category}</div>
      </div>

      <div class="status-box">
        <strong>PROFILE STATUS</strong>
        <div>${statusSummary.replace(/\n/g, "<br />")}</div>
      </div>

      <div class="section">
        <h2>Business Details</h2>
        <table>
          <tr><td class="label">Name</td><td>${business.name}</td></tr>
          <tr><td class="label">Category</td><td>${business.category}</td></tr>
          <tr><td class="label">Business Type</td><td>${business.businessType}</td></tr>
          <tr><td class="label">Section</td><td>${sectionValue}</td></tr>
          <tr><td class="label">Description</td><td>${business.description || "Not provided"}</td></tr>
          <tr><td class="label">Contact</td><td>${contactValue}</td></tr>
          <tr><td class="label">Pricing</td><td>${pricingValue}</td></tr>
          <tr><td class="label">Tags</td><td>${tagsValue}</td></tr>
        </table>
      </div>

      <div class="section">
        <h2>Profile Readiness</h2>
        <p class="meta">Completion: ${completionState.percentage}%</p>
        <table>
          ${checklistMarkup}
        </table>
        <p class="meta" style="margin-top: 12px;">Missing: ${missingValue}</p>
      </div>

      <div class="section">
        <h2>Recommendations / Notes</h2>
        <p class="meta">No recommendations available.</p>
      </div>

      <div class="footer">
        <div>Generated: ${new Date().toLocaleString()}</div>
        <div style="margin-top: 6px;">Generated by BizLink AI</div>
      </div>
    </div>
  </body>
</html>`;

  return { filename, html };
}

export function ProfileReadiness({ business }: ProfileReadinessProps) {
  const { checklist, percentage, isComplete, missingFields } = useMemo(() => getBusinessCompletionState(business), [business]);
  const [exportFeedback, setExportFeedback] = useState("");

  const completedCount = useMemo(() => {
    return checklist.filter((item) => item.complete).length;
  }, [checklist]);

  const handleExportReport = () => {
    if (typeof window === "undefined") return;

    const { filename, html } = generateBusinessReport(business);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);

    setExportFeedback("Report downloaded");
    window.setTimeout(() => setExportFeedback(""), 2200);
  };

  const statusLabel = useMemo(() => {
    if (percentage === 100) return "Profile ready";
    if (percentage >= 80) return "Almost ready";
    if (percentage >= 60) return "In progress";
    return "Needs information";
  }, [percentage]);

  const nextBestAction = useMemo(() => {
    if (isComplete) {
      return "Your business information is complete and ready for BizLink matching.";
    }
    const missing = checklist.find((item) => !item.complete);
    if (!missing) return "";

    const actionMap: Record<string, string> = {
      name: "Add a business name to complete your profile.",
      category: "Select a category for your business.",
      description: "Add a description of your business.",
      contact: "Add contact information (email, phone, or website) so your business can be verified.",
      pricing: "Add pricing information to complete your business profile.",
    };
    return actionMap[missing.key] || "";
  }, [checklist, isComplete]);

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-card)] p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Business Profile Readiness</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Complete your business information to improve BizLink recommendations.</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-large)] px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Download size={14} />
            Export Report
          </button>
          {exportFeedback && <span className="text-[11px] font-medium text-[var(--accent)]">{exportFeedback}</span>}
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3 mb-6">
        {checklist.map((item) => (
          <div key={item.key} className="flex items-center gap-3 p-3 rounded-[16px] bg-[var(--surface-large)]">
            <div className="flex-shrink-0">
              {item.complete ? (
                <CheckCircle2 size={20} className="text-[var(--accent)]" />
              ) : (
                <Circle size={20} className="text-[var(--border)]" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.complete ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-[var(--surface-panel)] text-[var(--text-secondary)]"}`}>
              {item.complete ? "Complete" : "Missing"}
            </span>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-[var(--text-primary)]">Profile completeness</p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{percentage}%</p>
        </div>
        <div className="h-2 bg-[var(--surface-large)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Status and Next Action */}
      <div className="rounded-[16px] bg-[var(--surface-large)] p-4 border border-[var(--border)]">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {isComplete ? (
              <CheckCircle2 size={18} className="text-[var(--accent)]" />
            ) : (
              <AlertCircle size={18} className="text-[var(--text-secondary)]" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {isComplete ? "Profile ready" : "Next best action"}
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{nextBestAction}</p>
          </div>
        </div>
      </div>

      {/* Quality Label */}
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
          percentage === 100
            ? "bg-[var(--accent)]/10 text-[var(--accent)]"
            : percentage >= 80
              ? "bg-[var(--text-secondary)]/10 text-[var(--text-secondary)]"
              : percentage >= 60
                ? "bg-[var(--text-muted)]/10 text-[var(--text-muted)]"
                : "bg-[var(--surface-panel)] text-[var(--text-secondary)]"
        }`}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}
