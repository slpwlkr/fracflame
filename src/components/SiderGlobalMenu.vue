<template>
  <sider-title router-link="/" />
  <n-divider />
  <div v-if="isLogin">
    <n-grid
      :col="24"
      :x-gap="9"
      :y-gap="9"
    >
      <n-gi :span="8">
        <n-avatar
          size="large"
          color="rgb(0, 0, 0)"
          :src="(user) ? user.avatar : undefined"
        >
          <n-icon v-if="user && !user.avatar">
            <user-icon />
          </n-icon>
        </n-avatar>
      </n-gi>
      <n-gi :span="16">
        {{ user ? user.username : '' }}
      </n-gi>
    </n-grid>
  </div>
  <div v-else>
    <n-grid
      :col="24"
      :x-gap="9"
      :y-gap="9"
    >
      <n-gi :span="12">
        <n-button
          :focusable="false"
          class="sider-button"
        >
          注册
        </n-button>
      </n-gi>
      <n-gi :span="12">
        <n-button
          :focusable="false"
          class="sider-button"
        >
          登录
        </n-button>
      </n-gi>
    </n-grid>
  </div>
  <n-divider />
  <n-menu
    :options="menuOptions"
    @update:value="(key) => { onMenuUpdate(key) }"
  />
</template>

<script lang="ts" setup>

import { computed, h } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {
  NGrid, NGi, NButton,
  NDivider, NAvatar, NIcon, NMenu
} from 'naive-ui'
import {
  UserCircleRegular as UserIcon,
  Home as HomeIcon,
  Search as BrowseIcon,
  Folder as ArtworkIcon,
  Bookmark as BookmarkIcon,
  DraftingCompass as CreateIcon
} from '@vicons/fa'
import { key } from '@/store'
import SiderTitle from '@/components/SiderTitle.vue'

const store = useStore(key)
const router = useRouter()
const isLogin = computed(() => store.state.isLogin)
const user = computed(() => store.state.user)

const menuOptions = computed(() => {
  return isLogin.value ? menuOptionsIsLogin : menuOptionsNotLogin
})
const menuOptionsIsLogin = [
  {
    label: '首页',
    key: 'home',
    icon: renderIcon(HomeIcon)
  },
  {
    label: '浏览',
    key: 'browse',
    icon: renderIcon(BrowseIcon)
  },
  {
    label: '新建作品',
    key: 'create',
    icon: renderIcon(CreateIcon)
  },
  {
    label: '我的作品',
    key: 'my-artworks',
    icon: renderIcon(ArtworkIcon)
  },
  {
    label: '我的收藏',
    key: 'my-bookmarks',
    icon: renderIcon(BookmarkIcon)
  }
]
const menuOptionsNotLogin = [
  {
    label: '首页',
    key: 'home',
    icon: renderIcon(HomeIcon)
  },
  {
    label: '浏览',
    key: 'browse',
    icon: renderIcon(BrowseIcon)
  }
]

function onMenuUpdate (key: string) {
  let routerLink = '/'
  switch (key) {
  case 'home':
    store.commit('setIsInEditor', false)
    routerLink = '/'
    break
  case 'browse':
    store.commit('setIsInEditor', false)
    routerLink = '/artworks'
    break
  case 'create':
    store.commit('createNewFlameInEditor')
    store.commit('setIsInEditor', true)
    routerLink = '/flame'
    break
  case 'my-artworks':
    store.commit('setIsInEditor', false)
    routerLink = '/my-artworks'
    break
  case 'my-bookmarks':
    store.commit('setIsInEditor', false)
    routerLink = '/my-bookmarks'
    break
  }

  router.push(routerLink)
}

function renderIcon (icon: typeof UserIcon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

</script>

<style scoped>
.sider-button {
  height: 48px;
  width: 100%;
}
</style>
