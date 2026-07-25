import { findAllPublishedPages } from "../pages/pages.repository.js";

interface PageCheckResult {
  pageId: string;
  pageTitle: string;
  hasMetaTitle: boolean;
  metaTitleOk: boolean;
  hasMetaDescription: boolean;
  metaDescriptionOk: boolean;
  contentLengthOk: boolean;
  imagesOk: boolean;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function checkImages(html: string): boolean {
  const imgTags = html.match(/<img[^>]*>/gi) ?? [];
  return imgTags.every((tag) => /alt\s*=\s*["'][^"']+["']/i.test(tag));
}

function evaluatePage(page: { id: string; title: string; metaTitle: string | null; metaDescription: string | null; content: string }): PageCheckResult {
  const metaTitle = page.metaTitle?.trim() ?? "";
  const metaDescription = page.metaDescription?.trim() ?? "";
  const textContent = stripHtml(page.content);

  return {
    pageId: page.id,
    pageTitle: page.title,
    hasMetaTitle: metaTitle.length > 0,
    metaTitleOk: metaTitle.length >= 10 && metaTitle.length <= 60,
    hasMetaDescription: metaDescription.length > 0,
    metaDescriptionOk: metaDescription.length >= 50 && metaDescription.length <= 160,
    contentLengthOk: textContent.length >= 300,
    imagesOk: checkImages(page.content),
  };
}

export async function getSeoAudit(businessId: string) {
  const pages = await findAllPublishedPages(businessId);

  if (pages.length === 0) {
    return {
      score: 0,
      totalPages: 0,
      checksPassed: 0,
      checksTotal: 0,
      criticalIssues: 0,
      warnings: 0,
      checklist: [],
      recommendations: [
        {
          label: "Publish at least one page",
          detail: "There are no published pages yet, so there's nothing to audit.",
          affectedPages: [] as string[],
        },
      ],
    };
  }

  const results = pages.map(evaluatePage);

  const checklist = [
    {
      id: "meta_title",
      label: "Meta title present & sized well (10–60 characters)",
      passCount: results.filter((r) => r.metaTitleOk).length,
      failCount: results.filter((r) => !r.metaTitleOk).length,
    },
    {
      id: "meta_description",
      label: "Meta description present & sized well (50–160 characters)",
      passCount: results.filter((r) => r.metaDescriptionOk).length,
      failCount: results.filter((r) => !r.metaDescriptionOk).length,
    },
    {
      id: "content_length",
      label: "Content is substantial (300+ characters)",
      passCount: results.filter((r) => r.contentLengthOk).length,
      failCount: results.filter((r) => !r.contentLengthOk).length,
    },
    {
      id: "image_alt_text",
      label: "All images have alt text",
      passCount: results.filter((r) => r.imagesOk).length,
      failCount: results.filter((r) => !r.imagesOk).length,
    },
  ];

  const checksTotal = checklist.length * results.length;
  const checksPassed = checklist.reduce((sum, c) => sum + c.passCount, 0);
  const score = checksTotal > 0 ? Math.round((checksPassed / checksTotal) * 100) : 0;

  const criticalIssues = results.filter((r) => !r.hasMetaTitle || !r.hasMetaDescription).length;
  const warnings = results.filter(
    (r) => (r.hasMetaTitle && !r.metaTitleOk) || (r.hasMetaDescription && !r.metaDescriptionOk) || !r.contentLengthOk || !r.imagesOk,
  ).length;

  const recommendations = [];

  const missingTitle = results.filter((r) => !r.hasMetaTitle);
  if (missingTitle.length > 0) {
    recommendations.push({
      label: `${missingTitle.length} page${missingTitle.length === 1 ? "" : "s"} missing a meta title`,
      detail: "Meta titles are what show up as the clickable headline in search results.",
      affectedPages: missingTitle.map((p) => p.pageTitle),
    });
  }

  const missingDescription = results.filter((r) => !r.hasMetaDescription);
  if (missingDescription.length > 0) {
    recommendations.push({
      label: `${missingDescription.length} page${missingDescription.length === 1 ? "" : "s"} missing a meta description`,
      detail: "Meta descriptions are the summary text shown under your title in search results.",
      affectedPages: missingDescription.map((p) => p.pageTitle),
    });
  }

  const thinContent = results.filter((r) => !r.contentLengthOk);
  if (thinContent.length > 0) {
    recommendations.push({
      label: `${thinContent.length} page${thinContent.length === 1 ? "" : "s"} with thin content`,
      detail: "Pages under 300 characters of content tend to rank poorly.",
      affectedPages: thinContent.map((p) => p.pageTitle),
    });
  }

  const missingAlt = results.filter((r) => !r.imagesOk);
  if (missingAlt.length > 0) {
    recommendations.push({
      label: `${missingAlt.length} page${missingAlt.length === 1 ? "" : "s"} with images missing alt text`,
      detail: "Alt text helps search engines (and screen readers) understand your images.",
      affectedPages: missingAlt.map((p) => p.pageTitle),
    });
  }

  return {
    score,
    totalPages: pages.length,
    checksPassed,
    checksTotal,
    criticalIssues,
    warnings,
    checklist,
    recommendations,
  };
}
