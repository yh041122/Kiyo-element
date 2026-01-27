<template>
  <div>
    <kiyo-button type="primary" loading>Loading</kiyo-button>
    <kiyo-button type="primary" loading-icon="circle-notch" loading
      >Loading</kiyo-button
    >
    <kiyo-button type="primary" loading>
      <template #loading>
        <kiyo-icon style="margin-right: 6px" icon="star" spin />
      </template>
      Loading
    </kiyo-button>
  </div>
</template>
