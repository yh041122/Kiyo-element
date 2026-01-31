import Message from "./methods";
import { withInstallFunction } from "@kiyo-element/utils";

export const KiyoMessage = withInstallFunction(Message, "$message");
export * from "./types";
