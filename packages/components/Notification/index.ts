import Notification from "./methods";
import { withInstallFunction } from "@kiyo-element/utils";

export const KiyoNotification = withInstallFunction(Notification, "$notify");
export * from "./types";
