<template>
  <n-card
    id="artwork-card"
    :title="artwork.title"
    @click="inputShouldShowArtworkModal = true"
  >
    <template #cover>
      <img :src="getImageURL(artwork.imageURL)">
    </template>
    <n-space v-if="!isMyArtwork">
      <n-icon>
        <user />
      </n-icon>
      <span>
        {{ artwork.username }}
      </span>
    </n-space>
  </n-card>
  <n-modal
    v-model:show="inputShouldShowArtworkModal"
  >
    <n-card
      id="artwork-modal-card"
      title="作品详情"
      size="large"
      :closable="true"
      @close="inputShouldShowArtworkModal = false"
    >
      <n-space
        vertical
        align="center"
        justify="center"
      >
        <img
          id="artwork-modal-image"
          :src="getImageURL(artwork.imageURL)"
        >
        <n-descriptions
          id="artwork-modal-description"
          :column="2"
          bordered
          label-placement="left"
          label-align="right"
          size="small"
        >
          <n-descriptions-item label="作者">
            {{ artwork.username }}
          </n-descriptions-item>
          <n-descriptions-item label="画布大小">
            {{ artwork.canvasWidth }} * {{ artwork.canvasHeight }} px
          </n-descriptions-item>
          <n-descriptions-item label="创建于">
            {{ toCNDatetimeString(artwork.createdAt) }}
          </n-descriptions-item>
          <n-descriptions-item label="上次更新于">
            {{ toCNDatetimeString(artwork.lastUpdatedAt) }}
          </n-descriptions-item>
        </n-descriptions>
      </n-space>
      <n-grid
        v-if="isMyArtwork"
        :cols="24"
        :x-gap="24"
      >
        <n-gi :span="12">
          <n-button
            class="modal-button"
            @click="onOpenArtwork"
          >
            编辑作品
          </n-button>
        </n-gi>
        <n-gi :span="12">
          <n-button
            class="modal-button"
            @click="onDeleteArtwork"
          >
            删除作品
          </n-button>
        </n-gi>
      </n-grid>
      <n-grid
        v-else-if="isLogin"
        :cols="24"
        :x-gap="24"
      >
        <n-gi :span="12">
          <n-button
            class="modal-button"
          >
            收藏作品
          </n-button>
        </n-gi>
        <n-gi :span="12">
          <n-button
            class="modal-button"
          >
            复制到我的作品
          </n-button>
        </n-gi>
      </n-grid>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>

import { PropType, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  NCard, NIcon, NSpace, NModal, NGrid, NGi,
  NDescriptions, NDescriptionsItem, NButton
} from 'naive-ui'
import { User } from '@vicons/fa'
import { IArtwork } from '@/store'
import { getImageURL, toCNDatetimeString } from '@/utils/Helper'

const props = defineProps({
  artwork: {
    type: Object as PropType<IArtwork>,
    default: () => { return {} }
  },
  isMyArtwork: {
    type: Boolean,
    default: false
  },
  isLogin: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const inputShouldShowArtworkModal = ref(false)

function onOpenArtwork () {
  router.push('/flame')
  // TODO:push的时候传入该作品参数
}

function onDeleteArtwork () {
  console.log('准备删除某个作品')
}

</script>

<style scoped>
#artwork-card {
  width: 360px;
  height: 320px;
  cursor: pointer;
}
#artwork-modal-card {
  width: 640px;
}
#artwork-modal-image {
  width: 560px;
  height: 400px;
  object-fit: contain;
}
#artwork-modal-description {
  width: 560px;
}
.modal-button {
  height: 40px;
  width: 100%;
  margin-top: 24px
}
</style>
