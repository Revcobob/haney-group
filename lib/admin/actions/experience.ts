"use server";

import { createEntityAction, updateEntityAction } from "./entities";
import type { ActionResult } from "./_helpers";

export async function createExperienceAction(
  prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  return createEntityAction("cms_experience_items", prev, formData);
}

export async function updateExperienceAction(
  id: string,
  prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  return updateEntityAction("cms_experience_items", id, prev, formData);
}
