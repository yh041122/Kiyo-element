import type { Plugin } from "vue";
import { describe, it, expect } from "vitest";
import { map, get } from "lodash-es";
import {
  KiyoAlert,
  KiyoButton,
  KiyoButtonGroup,
  KiyoCollapse,
  KiyoCollapseItem,
  KiyoIcon,
  KiyoTooltip,
} from "../index";

const comps = [
  KiyoAlert,
  KiyoButton,
  KiyoButtonGroup,
  KiyoCollapse,
  KiyoCollapseItem,
  KiyoIcon,
  KiyoTooltip,
] as Plugin[];

describe("components/index", () => {
  it.each(map(comps, (c) => [get(c, "name") ?? "", c]))(
    "%s shoule be exported",
    (_, component) => {
      expect(component).toBeDefined();
      expect(component.install).toBeDefined();
    },
  );
});
