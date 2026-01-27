<template>
  <h2>通过 slot 传入内容</h2>
  <div style="max-width: 600px">
    <kiyo-alert type="success">Success alert</kiyo-alert>
    <kiyo-alert type="info">Info alert</kiyo-alert>
    <kiyo-alert type="warning">Warning alert</kiyo-alert>
    <kiyo-alert type="danger">Error alert</kiyo-alert>
  </div>
  <h2>通过 prop 传入内容</h2>
  <div style="max-width: 600px">
    <kiyo-alert type="success" title="Success alert" />
    <kiyo-alert type="info" title="Info alert" />
    <kiyo-alert type="warning" title="Warning alert" />
    <kiyo-alert type="danger" title="Error alert" />
  </div>
</template>
