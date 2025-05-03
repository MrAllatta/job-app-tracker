// reset_system.ts - Full system reset and clean
function resetSystem(): void {
  const scriptProps = PropertiesService.getScriptProperties();
  const ssId = scriptProps.getProperty(SCRIPT_PROP_SHEET_ID);
  if (ssId) {
    DriveApp.getFileById(ssId).setTrashed(true);
    scriptProps.deleteProperty(SCRIPT_PROP_SHEET_ID);
  }
  // Remove existing onEdit triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEdit') {
      ScriptApp.deleteTrigger(trigger);
      Logger.log(`resetSystem: Deleted onEdit trigger ${trigger.getUniqueId()}`);
    }
  });
  initializeSheets();
}
