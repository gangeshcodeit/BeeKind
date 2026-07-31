/**
 * Matches server: scenes 1 … N-1 must be approved before scene N.
 * @returns {number|null} first missing prerequisite scene number, or null if allowed.
 */
export function firstIncompletePrerequisiteScene(completedSceneIds, targetSceneNumber) {
  if (!Number.isFinite(targetSceneNumber) || targetSceneNumber < 1 || targetSceneNumber > 10) {
    return null;
  }
  const completed = Array.isArray(completedSceneIds) ? completedSceneIds : [];
  for (let i = 1; i < targetSceneNumber; i += 1) {
    const id = `scene-${i}`;
    if (!completed.includes(id)) {
      return i;
    }
  }
  return null;
}

export function parseSceneIdInput(value) {
  const m = /^scene-(\d+)$/i.exec(String(value || "").trim());
  return m ? Number(m[1]) : NaN;
}
