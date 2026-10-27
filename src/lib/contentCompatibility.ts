// Version-one aliases are accepted at import boundaries; editors and public
// components use one canonical field thereafter.
export function normalizeSiteSettings(value: unknown): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const { whatDrivesMe, myJourney, educationCoursework, ...settings } = value as Record<string, unknown>;
  if (settings.aboutDrivesMe === undefined && whatDrivesMe !== undefined) settings.aboutDrivesMe = whatDrivesMe;
  if (settings.aboutJourney === undefined && myJourney !== undefined) settings.aboutJourney = myJourney;
  if (educationCoursework !== undefined && settings.education && typeof settings.education === 'object') {
    const education = settings.education as Record<string, unknown>;
    if (!Array.isArray(education.coursework) || !education.coursework.length) settings.education = { ...education, coursework: educationCoursework };
  }
  return settings;
}
export function normalizeLegacyContent(value: unknown): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const document = value as Record<string, unknown>;
  return { ...document, siteSettings: normalizeSiteSettings(document.siteSettings) };
}
