<template>
  <div class="tooltip-base-box">
    <div class="row center">
      <kiyo-tooltip
        class="box-item"
        content="Top Left prompts info"
        placement="top-start"
      >
        <kiyo-button>top-start</kiyo-button>
      </kiyo-tooltip>
      <kiyo-tooltip
        class="box-item"
        content="Top Center prompts info"
        placement="top"
      >
        <kiyo-button>top</kiyo-button>
      </kiyo-tooltip>
      <kiyo-tooltip
        class="box-item"
        content="Top Right prompts info"
        placement="top-end"
      >
        <kiyo-button>top-end</kiyo-button>
      </kiyo-tooltip>
    </div>
    <div class="row">
      <kiyo-tooltip
        class="box-item"
        content="Left Top prompts info"
        placement="left-start"
      >
        <kiyo-button>left-start</kiyo-button>
      </kiyo-tooltip>
      <kiyo-tooltip
        class="box-item"
        content="Right Top prompts info"
        placement="right-start"
      >
        <kiyo-button>right-start</kiyo-button>
      </kiyo-tooltip>
    </div>
    <div class="row">
      <kiyo-tooltip
        class="box-item"
        content="Left Center prompts info"
        placement="left"
      >
        <kiyo-button class="mt-3 mb-3">left</kiyo-button>
      </kiyo-tooltip>
      <kiyo-tooltip
        class="box-item"
        content="Right Center prompts info"
        placement="right"
      >
        <kiyo-button>right</kiyo-button>
      </kiyo-tooltip>
    </div>
    <div class="row">
      <kiyo-tooltip
        class="box-item"
        content="Left Bottom prompts info"
        placement="left-end"
      >
        <kiyo-button>left-end</kiyo-button>
      </kiyo-tooltip>
      <kiyo-tooltip
        class="box-item"
        content="Right Bottom prompts info"
        placement="right-end"
      >
        <kiyo-button>right-end</kiyo-button>
      </kiyo-tooltip>
    </div>
    <div class="row center">
      <kiyo-tooltip
        class="box-item"
        content="Bottom Left prompts info"
        placement="bottom-start"
      >
        <kiyo-button>bottom-start</kiyo-button>
      </kiyo-tooltip>
      <kiyo-tooltip
        class="box-item"
        content="Bottom Center prompts info"
        placement="bottom"
      >
        <kiyo-button>bottom</kiyo-button>
      </kiyo-tooltip>
      <kiyo-tooltip
        class="box-item"
        content="Bottom Right prompts info"
        placement="bottom-end"
      >
        <kiyo-button>bottom-end</kiyo-button>
      </kiyo-tooltip>
    </div>
  </div>
</template>

<style>
.tooltip-base-box {
  width: 600px;
}
.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tooltip-base-box .center {
  justify-content: center;
}
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}
</style>
