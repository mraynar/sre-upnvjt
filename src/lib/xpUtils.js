/**
 * Helper function to calculate Speed Bonus XP (scale 0-10 XP)
 * Based on how early a member submits relative to task deadline.
 *
 * @param {Date|string} taskCreatedAt - Task creation time
 * @param {Date|string} taskDeadline - Task deadline time
 * @param {Date|string} submittedAt - Member submission time
 * @returns {number} Speed bonus XP (0 if late, 1-10 if on time)
 */
export function calculateSpeedBonusXp(taskCreatedAt, taskDeadline, submittedAt) {
  if (!taskDeadline || !submittedAt) return 0;

  const dline = new Date(taskDeadline).getTime();
  const subTime = new Date(submittedAt).getTime();

  // If submitted after or at deadline -> 0 bonus XP
  if (subTime >= dline) return 0;

  // Default duration fallback: 7 days before deadline if createdAt is missing
  const defaultStart = dline - 7 * 24 * 60 * 60 * 1000;
  const createdTime = taskCreatedAt ? new Date(taskCreatedAt).getTime() : defaultStart;
  const totalDuration = Math.max(1, dline - createdTime);

  const timeRemaining = dline - subTime;
  const ratio = Math.max(0, Math.min(1, timeRemaining / totalDuration));

  // Scale 1-10 for on-time submission (Earlier submission = higher XP)
  const speedBonus = Math.min(10, Math.max(1, Math.round(10 * ratio)));
  return speedBonus;
}
