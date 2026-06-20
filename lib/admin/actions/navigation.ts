"use server";

import { createEntityAction, updateEntityAction } from "./entities";
import type { ActionResult } from "./_helpers";

export async function createNavItemAction(
  prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  return createEntityAction("cms_navigation_items", prev, formData);
}

export async function updateNavItemAction(
  id: string,
  prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  return updateEntityAction("cms_navigation_items", id, prev, formData);
}
