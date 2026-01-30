import { withInstall } from "@kiyo-element/utils";
import Dropdown from "./Dropdown.vue";
import DropdownItem from "./DropdownItem.vue";

export const KiyoDropdown = withInstall(Dropdown);
export const KiyoDropdownItem = withInstall(DropdownItem);

export * from "./types";
