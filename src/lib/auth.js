export function getUserId() {
  let userId = localStorage.getItem('budget_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('budget_user_id', userId);
  }
  return userId;
}
