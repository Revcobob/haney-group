"use server";

import { createEntityAction, updateEntityAction } from "./entities";
import type { ActionResult } from "./_helpers";

export async function createClientLogoAction(
  prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  return createEntityAction("cms_client_logos", prev, formData);
}

export async function updateClientLogoAction(
  id: string,
  prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  return updateEntityAction("cms_client_logos", id, prev, formData);
}
