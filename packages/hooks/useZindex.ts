import { computed, ref } from "vue";

const zIndex = ref(0);

export default function useZindex(initVal = 2000) {
  const _initVal = ref(initVal);
  const currentZindex = computed(() => zIndex.value + _initVal.value);

  const nextZindex = () => {
    zIndex.value++;
    return currentZindex.value;
  };

  return {
    initValue: _initVal,
    currentZindex,
    nextZindex,
  };
}
