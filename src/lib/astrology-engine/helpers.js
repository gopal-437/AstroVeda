/**
 * Generate a consistent hash from birth details.
 * Used to lock/unlock reports specific to the inputted birth data.
 */
export function getBirthHash(details) {
  if (!details) return "guest";
  
  // Normalize the details to exclude small format variances
  const normalized = {
    name: (details.name || "").trim().toLowerCase(),
    dob: details.dob || "",
    tob: details.tob || "",
    pob: (details.pob || "").trim().toLowerCase(),
    
    // Support compatibility details
    partnerName: (details.partnerName || "").trim().toLowerCase(),
    partnerDob: details.partnerDob || "",
    partnerTob: details.partnerTob || "",
    partnerPob: (details.partnerPob || "").trim().toLowerCase(),
  };

  const str = JSON.stringify(normalized);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}
