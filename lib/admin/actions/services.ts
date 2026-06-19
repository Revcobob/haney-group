"use server";

import {
  createEntityAction,
  updateEntityAction,
} from "./entities";
import type { ActionResult } from "./_helpers";

export async function createServiceAction(
  prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  return createEntityAction("cms_services", prev, formData);
}

export async function updateServiceAction(
  id: string,
  prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  return updateEntityAction("cms_services", id, prev, formData);
}
