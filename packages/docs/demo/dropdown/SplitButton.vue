<script setup lang="ts">
import { type DropdownItemProps, KiyoMessage } from "kiyo-element";

const items: DropdownItemProps[] = [
  { command: "1", label: "Action 1" },
  { command: "2", label: "Action 2" },
  { command: "3", label: "Action 3", disabled: true },
  { command: "4", label: "Action 4", divided: true },
];

function handleClick() {
  KiyoMessage.info("button click");
}
</script>

<template>
  <div class="row">
    <kiyo-dropdown :items="items">
      <kiyo-button type="primary">
        Dropdown List
        <kiyo-icon icon="angle-down" style="margin-left: 8px" />
      </kiyo-button>
    </kiyo-dropdown>
    <kiyo-dropdown
      :items="items"
      type="primary"
      @click="handleClick"
      split-button
    >
      Dropdown List
    </kiyo-dropdown>
  </div>
</template>

<style scoped>
.row div {
  margin-right: 16px;
}
</style>
