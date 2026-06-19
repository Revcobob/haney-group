"use server";

import { createEntityAction, updateEntityAction } from "./entities";
import type { ActionResult } from "./_helpers";

export async function createIndustryAction(
  prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  return createEntityAction("cms_industries", prev, formData);
}

export async function updateIndustryAction(
  id: string,
  prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  return updateEntityAction("cms_industries", id, prev, formData);
}
