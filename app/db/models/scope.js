export function initScope(models) {
  // Priority, careful of infinite loop
  models.Subject.defineScope(models)
  models.Cost.defineScope(models)
}
