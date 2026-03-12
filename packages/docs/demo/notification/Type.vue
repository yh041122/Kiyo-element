<script lang="ts" setup>
import { KiyoNotification } from "kiyo-element";

const open1 = () => {
  KiyoNotification({
    title: "Success",
    message: "This is a success message",
    type: "success",
  });
};

const open2 = () => {
  KiyoNotification({
    title: "Warning",
    message: "This is a warning message",
    type: "warning",
  });
};

const open3 = () => {
  KiyoNotification({
    title: "Info",
    message: "This is an info message",
    type: "info",
  });
};

const open4 = () => {
  KiyoNotification({
    title: "Error",
    message: "This is an error message",
    type: "danger",
  });
};
</script>

<template>
  <kiyo-button plain @click="open1"> Success </kiyo-button>
  <kiyo-button plain @click="open2"> Warning </kiyo-button>
  <kiyo-button plain @click="open3"> Info </kiyo-button>
  <kiyo-button plain @click="open4"> Error </kiyo-button>
</template>
