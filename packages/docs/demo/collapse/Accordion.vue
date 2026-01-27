<script setup lang="ts">
import { ref } from "vue";

const activeNames = ref(["1"]);
</script>

<template>
  <kiyo--collapse v-model="activeNames" accordion>
    <kiyo--collapse-item title="Consistency" name="1">
      <div>
        Consistent with real life: in line with the process and logic of real
        life, and comply with languages and habits that the uskiyo-s are used
        to;
      </div>
      <div>
        Consistent within intkiyo-face: all elements should be consistent, such
        as: design style, icons and texts, position of elements, etc.
      </div>
    </kiyo--collapse-item>
    <kiyo--collapse-item title="Feedback" name="2">
      <div>
        Opkiyo-ation feedback: enable the uskiyo-s to clearly pkiyo-ceive their
        opkiyo-ations by style updates and intkiyo-active effects;
      </div>
      <div>
        Visual feedback: reflect current state by updating or rearranging
        elements of the page.
      </div>
    </kiyo--collapse-item>
    <kiyo--collapse-item title="Efficiency" name="3">
      <div>
        Simplify the process: keep opkiyo-ating process simple and intuitive;
      </div>
      <div>
        Definite and clear: enunciate your intentions clearly so that the
        uskiyo-s can quickly undkiyo-stand and make decisions;
      </div>
      <div>
        Easy to identify: the intkiyo-face should be straightforward, which
        helps the uskiyo-s to identify and frees them from memorizing and
        recalling.
      </div>
    </kiyo--collapse-item>
    <kiyo--collapse-item title="Controllability" name="4">
      <div>
        Decision making: giving advices about opkiyo-ations is acceptable, but
        do not make decisions for the uskiyo-s;
      </div>
      <div>
        Controlled consequences: uskiyo-s should be granted the freedom to
        opkiyo-ate, including canceling, aborting or tkiyo-minating current
        opkiyo-ation.
      </div>
    </kiyo--collapse-item>
  </kiyo--collapse>
</template>
