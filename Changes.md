# TaskNest — Findings and Changes

## 1. How the original score worked

The original implementation mixed a stored Score.value with a computed momentum bonus. Creating any task added 5 stored points; marking a task complete added another 10; deleting a task did not reverse either increment. The score endpoint then added a second calculation based on the number of completed tasks. As a result, the same task list could have a different score depending on its interaction history.

## 2. Issues discovered

- Task creation increased the score even when no work had been completed.
- Completing a task could add points repeatedly on repeated requests.
- Deletion never reconciled the stored score.
- The API combined a persisted counter with a separate bonus, so the score did not represent a single coherent rule.
- The requirement mentioned important tasks, but the task model and UI had no importance field.
- The existing momentum helper used a discontinuous multiplier after two completed tasks and duplicated information already present in the score endpoint.

## 3. Proposed improvements

A score should be recalculable from the current task data and explainable to a user. The new formula has two explicit parts: up to 80 points for weighted task completion and up to 20 points for consistency across distinct completion days in the trailing seven-day window. Important tasks carry weight 2; other tasks carry weight 1. The total is capped at 100.

## 4. Implementation details

- Added Task.important and nullable Task.completedAt fields.
- Replaced stored score increments and the old momentum bonus with a pure calculateProductivityScore helper.
- Updated the score API to return the total, component scores, active days, and task counts.
- Updated create/update APIs to validate input, record completion transitions, and return meaningful 400/404/500 errors.
- Added an importance toggle, importance selection during task creation, and a score breakdown in the React UI.
- Made the API URL configurable for deployment and added environment examples, health endpoint, and scoring unit tests.

## 5. Verification status

The code includes client build/lint scripts and server unit tests. Run those checks locally and complete live deployment plus the 3–5 minute explanation video before marking those separate assignment deliverables complete.
