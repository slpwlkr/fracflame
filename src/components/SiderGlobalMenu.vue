<template>
  <sider-title router-link="/" />
  <n-divider />
  <div v-if="isLogin">
    <n-space justify="center">
      <n-button
        size="large"
        round
        text
        @click="inputShouldShowUserMenuModal = true"
      >
        <n-avatar
          id="user-avatar"
          size="large"
          color="rgb(0, 0, 0)"
          object-fit="contain"
          :src="(user && user.avatar) ? getImageURL(user.avatar) : undefined"
        >
          <n-icon v-if="user && !user.avatar">
            <user-icon />
          </n-icon>
        </n-avatar>
      </n-button>
    </n-space>
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
          @click="inputShouldShowRegisterModal = true"
        >
          注册
        </n-button>
      </n-gi>
      <n-gi :span="12">
        <n-button
          :focusable="false"
          class="sider-button"
          @click="inputShouldShowLoginModal = true"
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
  <n-modal
    v-model:show="inputShouldShowLoginModal"
  >
    <n-card
      id="login-modal-card"
      title="登录"
      size="large"
      :closable="true"
      @close="inputShouldShowLoginModal = false"
    >
      <n-form
        ref="inputLoginFormRef"
        :model="inputLoginFormValue"
        :rules="inputLoginFormRules"
        :show-require-mark="false"
      >
        <n-form-item
          label="用户名"
          path="username"
        >
          <n-input
            v-model:value="inputLoginFormValue.username"
            placeholder="请输入用户名"
            :maxlength="64"
          />
        </n-form-item>
        <n-form-item
          label="密码"
          path="password"
        >
          <n-input
            v-model:value="inputLoginFormValue.password"
            placeholder="请输入密码"
            type="password"
            show-password-on="mousedown"
            :maxlength="64"
          />
        </n-form-item>
      </n-form>
      <n-button
        class="modal-button"
        @click="onLogin"
      >
        登录
      </n-button>
    </n-card>
  </n-modal>
  <n-modal
    v-model:show="inputShouldShowRegisterModal"
  >
    <n-card
      id="register-modal-card"
      title="注册"
      size="large"
      :closable="true"
      @close="inputShouldShowRegisterModal = false"
    >
      <n-form
        ref="inputRegisterFormRef"
        :model="inputRegisterFormValue"
        :rules="inputRegisterFormRules"
        :show-require-mark="false"
      >
        <n-form-item
          label="用户名"
          path="username"
        >
          <n-input
            v-model:value="inputRegisterFormValue.username"
            placeholder="请输入用户名"
            :maxlength="64"
          />
        </n-form-item>
        <n-form-item
          label="密码"
          path="password"
        >
          <n-input
            v-model:value="inputRegisterFormValue.password"
            placeholder="请输入密码"
            type="password"
            show-password-on="mousedown"
            :maxlength="64"
          />
        </n-form-item>
        <n-form-item
          label="密码"
          path="passwordRepeat"
        >
          <n-input
            v-model:value="inputRegisterFormValue.passwordRepeat"
            placeholder="请再次输入密码"
            type="password"
            show-password-on="mousedown"
            :maxlength="64"
          />
        </n-form-item>
      </n-form>
      <n-button class="modal-button">
        注册
      </n-button>
    </n-card>
  </n-modal>
  <n-modal
    v-model:show="inputShouldShowUserMenuModal"
  >
    <n-card
      id="user-menu-modal-card"
      title="我的信息"
      size="large"
      :closable="true"
      @close="inputShouldShowUserMenuModal = false"
    >
      <n-space
        vertical
        align="center"
        justify="center"
      >
        <n-avatar
          size="large"
          color="rgb(0, 0, 0)"
          object-fit="contain"
          :src="(user && user.avatar) ? getImageURL(user.avatar) : undefined"
        >
          <n-icon v-if="user && !user.avatar">
            <user-icon />
          </n-icon>
        </n-avatar>
        <p>
          {{ user ? user.username : '' }}
        </p>
      </n-space>
      <n-button
        class="modal-button"
      >
        修改信息
      </n-button>
      <n-button
        class="modal-button"
        @click="onLogout"
      >
        登出
      </n-button>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>

import { computed, h, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {
  NGrid, NGi, NButton, NModal, NCard, NSpace,
  NForm, NFormItem, NInput,
  NDivider, NAvatar, NIcon, NMenu
} from 'naive-ui'
import {
  UserCircle as UserIcon,
  Home as HomeIcon,
  Search as BrowseIcon,
  Folder as ArtworkIcon,
  Bookmark as BookmarkIcon,
  DraftingCompass as CreateIcon
} from '@vicons/fa'
import { key, IUser } from '@/store'
import { getImageURL } from '@/utils/Helper'
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

const inputShouldShowLoginModal = ref(false)
const inputLoginFormValue = ref({
  username: '',
  password: ''
})
const inputLoginFormRef = ref(null)
const inputLoginFormRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
}

function onLogin () {
  const { username, password } = inputLoginFormValue.value
  if (username && password) {
    const loginUser: IUser = {
      userID: '1',
      username: username
    }
    store.commit('login', loginUser)
    inputShouldShowLoginModal.value = false
  }
}

const inputShouldShowRegisterModal = ref(false)
const inputRegisterFormValue = ref({
  username: '',
  password: '',
  passwordRepeat: ''
})
const inputRegisterFormRef = ref(null)
const inputRegisterFormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ],
  passwordRepeat: [
    {
      required: true,
      validator (rule: unknown, value: string) {
        if (!value) {
          return new Error('请再次输入密码')
        } else if (!(value === inputRegisterFormValue.value.password)) {
          return new Error('两次输入密码不一致')
        }
        return true
      },
      trigger: 'blur'
    }
  ]
}

const inputShouldShowUserMenuModal = ref(false)

function onLogout () {
  store.commit('logout')
  inputShouldShowUserMenuModal.value = false
}

</script>

<style scoped>
.sider-button {
  height: 48px;
  width: 100%;
}
#login-modal-card, #register-modal-card, #user-menu-modal-card {
  width: 480px
}
#user-avatar {
  cursor: pointer;
}
.modal-button {
  height: 40px;
  width: 100%;
  margin-top: 24px
}
</style>
