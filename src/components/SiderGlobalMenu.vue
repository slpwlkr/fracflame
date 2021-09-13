<template>
  <sider-title router-link="/" />
  <n-divider />
  <div v-if="isLogin">
    <n-space vertical align="center">
      <n-button
        size="large"
        round
        text>
        <!-- @click="inputShouldShowUserMenuModal = true" -->
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
      <n-menu
        :options="userMenuOptions"
        :indent="6"
        :root-indent="9"
        @update:value="(key) => { onUserMenuUpdate(key) }"
      />
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
            show-count
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
          label="再次输入密码"
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
      <n-button
        class="modal-button"
        @click="onRegister"
      >
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
      </n-space>
      <n-space>
        <n-descriptions
          id="user-file-description"
          :column="1"
          bordered
          label-placement="left"
          label-align="right"
        >
          <n-descriptions-item label="用户名">
            {{ user.username }}
          </n-descriptions-item>
          <n-descriptions-item label="用户ID">
            {{ user.userid }}
          </n-descriptions-item>
        </n-descriptions>
      </n-space>
    </n-card>
  </n-modal>
  <n-modal
    v-model:show="inputShouldShowUserEditModal"
  >
    <n-card
      id="name-editor-model-card"
      title="修改信息"
      size="large"
      :closable="true"
      @close="inputShouldShowUserEditModal = false"
    >
      <n-form
        ref="inputEditFormRef"
        :model="inputEditFormValue"
        :rules="inputEditFormRules"
        :show-require-mark="false">
        <n-form-item
          label="新用户名"
          path="newUserName"
        >
          <n-input
            v-model:value="inputEditFormValue.newUsername"
            placeholder="请输入新用户名，不修改请留空"
            :maxlength="64"
            show-count
          />
        </n-form-item>
        <n-form-item
          label="新密码"
          path="newPassword"
        >
          <n-input
            v-model:value="inputEditFormValue.newPassword"
            placeholder="请输入新密码，不修改请留空"
            :maxlength="64"
            show-count
          />
        </n-form-item>
      </n-form>
      <n-grid
        x-gap="15"
        :cols="1"
        align="middle"
      >
        <n-grid-item>
          <n-button
            id="submitEditButton"
            @click="onEditProfile"
            size="large"
          >
            提交
          </n-button>
        </n-grid-item>
        <n-divider></n-divider>
        <n-grid-item>
          <n-button
            id="removeAccountButton"
            type="error"
            @click="onRemoveAccount"
            size="large"
          >
            注销账户
          </n-button>
        </n-grid-item>
      </n-grid>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>

import { computed, h, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {
  NGrid, NGi, NButton, NModal, NCard, NSpace,
  NForm, NFormItem, NInput, NDescriptionsItem,
  NDivider, NAvatar, NIcon, NMenu, NDescriptions,
  NGridItem,
  useMessage
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
import axios from 'axios'

const store = useStore(key)
const router = useRouter()
const isLogin = computed(() => store.state.isLogin)
const user = computed(() => store.state.user)

const userMenuOptions = [
  {
    label: () => user.value?.username,
    key: 'user',
    children: [
      {
        label: '我的资料',
        key: 'aboutMe'
      },
      {
        label: '修改信息',
        key: 'editFile'
      },
      {
        label: '登出',
        key: 'logout'
      }
    ]
  }
]

function onUserMenuUpdate (key: string) {
  switch (key) {
  case 'aboutMe':
    inputShouldShowUserMenuModal.value = true
    break
  case 'editFile':
    inputShouldShowUserEditModal.value = true
    break
  /* case 'removeAccount':
     console.log('id is ' + store.state.user?.userid)
     try {
       store.dispatch('removeAccount', store.state.user?.userid)
     } catch (e) {
       console.log(e)
     }
     store.commit('logout')
     router.push('/')
    */
  case 'logout':
    store.commit('logout')
    router.push('/')
    break
  }
}

function onRemoveAccount () {
  inputShouldShowUserEditModal.value = false
  try {
    store.dispatch('removeAccount', store.state.user?.userid)
  } catch (e) {
    console.log(e)
  }
  message.success('注销成功')
  onLogout()
}

function onEditProfile () {
  const { newUsername, newPassword } = inputEditFormValue.value
  if (!newUsername && !newPassword) {
    message.error('未输入任何内容，已取消修改')
  } else {
    if (newUsername) {
      if (!isValid(newUsername)) {
        message.error('新用户名不合法，请重新输入')
        return false
      } else {
        axios.defaults.headers.common.Authorization = `Bearer ${store.state.token}`
        try {
          const acc = { username: newUsername }
          axios.patch(`/users/${user.value?.userid}`, acc).then((response) => {
            console.log(response)
            message.success('修改用户名成功')
          })
            .catch(function (error) {
              message.error('修改用户名失败,错误信息：' + `${error.message}`)
              return false
            })
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
  if (newPassword) {
    axios.defaults.headers.common.Authorization = `Bearer ${store.state.token}`
    try {
      console.log('patching new password')
      const pwd = { password: newPassword }
      axios.patch(`/users/${user.value?.userid}`, pwd).then((response) => {
        console.log(response)
        message.success('修改密码成功')
      })
    } catch (e) {
      console.log(e)
      message.error('修改密码失败')
      return false
    }
  }
  inputShouldShowUserEditModal.value = false
  onLogout()
}

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

const message = useMessage()

function onLogin () {
  const { username, password } = inputLoginFormValue.value
  if (username && password && isValid(username)) {
    const payload = {
      username: username,
      password: password
    }

    store.dispatch('login', payload).then(response => {
      console.log(response)
      message.success('登录成功，欢迎回来')
      inputShouldShowLoginModal.value = false
    })
      .catch(function (error) {
        console.log(error)
        message.error('登录失败，账号或密码错误')
      })
  }
}

const inputShouldShowUserEditModal = ref(false)
const inputEditFormValue = ref({
  newUsername: '',
  newPassword: ''
})
const inputEditFormRules = {
  newUsername: [{
    validator (rule, value) {
      if (value && !/^\w+$/.test(value)) {
        return new Error('用户名非法')
      } else return true
    },
    trigger: ['input', 'blur']
  }]
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
      validator (rule, value, callback) {
        if (!value) {
          return new Error('请输入用户名')
        } else if (!/^\w+$/.test(value)) {
          return new Error('用户名非法')
        } else return true
      },
      trigger: ['input', 'blur']
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

function isValid (str: string) { return /^\w+$/.test(str) }

function onRegister () {
  const { username, password, passwordRepeat } = inputRegisterFormValue.value
  if (password !== passwordRepeat) {
    message.error('两次密码输入不一致，请重新输入密码')
    return false
  } else if (isValid(username)) {
    store.dispatch('register', { username, password }).then(response => {
      console.log('response is:')
      console.log(response)
      message.success('注册成功，请使用该用户密码登录')
      inputShouldShowRegisterModal.value = false
    })
      .catch(function (error) {
        console.log(error)
        message.error(`注册失败，错误信息：${error}`)
      })
  } else {
    message.error('用户名输入有误，请重新输入')
    return false
  }
}

const inputShouldShowUserMenuModal = ref(false)

function onLogout () {
  store.commit('logout')
  inputShouldShowUserMenuModal.value = false
}

onMounted(() => {
  if (localStorage.getItem('token')) {
    console.log(`currentToken is ${store.state.token}`)
    store.dispatch('fetchCurrentUser')
  }
})

</script>

<style scoped>
.sider-button {
  height: 48px;
  width: 100%;
}
#login-modal-card, #register-modal-card, #user-menu-modal-card, #name-editor-model-card {
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
#user-file-description {
  width: 400px
}

#submitEditButton, #removeAccountButton {
  width: 100%;
}
</style>
