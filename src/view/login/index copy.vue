<template>
  <div class="login-container">
    <!-- 背景 -->
    <iframe :src="url" allow="fullscreen" scrolling="no"  frameborder="0" style="width:100vw;height:calc(100vh - 50px); position: fixed;top: 50px;left: 0;box-sizing:border-box;z-index:0"></iframe>

    <!-- header -->
    <div class="header">
      <div class="header-content">
        <span style="position:absolute;left: 0px;width: auto;height: 55px">
          <el-image style="top: 0px;left: 10px;height:50px;" fit="scale-down" src="">
            <div slot="error" class="image-slot">
              <img style="top: 0px;left: 10px;height:50px;" src="@/assets/vue.svg">
            </div>
          </el-image>
        </span>
        <span class="top-name">
        <span class="comp-name">11111</span>
      </span>
      </div>
    </div>


    <el-form ref="form" :model="form" :rules="rules" class="login-form" label-position="left" >
      <div class="title-container">
        <h3 class="title">
          {{ title }}
        </h3>
      </div>
      <el-form-item prop="username">
            <span class="svg-container svg-container-admin">
              <vab-icon :icon="['fas', 'user']" />
            </span>
        <el-input
          v-model.trim="form.username"
          v-focus
          placeholder="请输入用户名"
          tabindex="1"
          type="text"
        />
      </el-form-item>
      <el-form-item prop="password">
            <span class="svg-container">
              <vab-icon :icon="['fas', 'lock']" />
            </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model.trim="form.password"
          :type="passwordType"
          tabindex="2"
          placeholder="请输入密码"
          show-password
          @keyup.enter.native="handleLogin"
        />
      </el-form-item>
      <el-form-item v-if="captchaFlag" prop="captcha">
            <span class="svg-container">
              <i class="el-icon-warning" />
            </span>
        <el-input
          ref="captcha"
          v-model.trim="form.captcha"
          placeholder="请输入验证码"
          name="captcha"
          type="text"
          tabindex="1"
          autocomplete="on"
          maxlength="10"
          style="width: calc(100% - 200px)"
          @keyup.enter.native="handleLogin"
        />
        <img
          class="captcha"
          style="float: right"
          title="看不清，换一张"
          alt="验证码"
          :src="captchaImg"
          @click="getCaptcha"
        />
      </el-form-item>
      <el-button
        :loading="loading"
        class="login-btn"
        type="primary"
        @click="handleLogin"
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        登录
      </el-button>
    </el-form>


    <!-- footer -->
    <div class="footer">
      <div class="footer-content">
       <p>Copyright©  <a target="_blank" href="http://www.landgroup.com.cn/">南方电网</a> 2010-2021 保留所有权利</p>
        <!-- <p>{{copyRight}}</p> -->
        <!-- <p>
          Copyright
          <vab-icon :icon="['fas', 'copyright']"></vab-icon>
          {{ this.$globalParam.sys_copy_right }} - {{ this.$globalParam.sys_version }}
        </p> -->
      </div>
    </div>

  </div>
  
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  const url = ref<string>(window.location.origin+'/canvas.html')

  // const input = ref<HTMLInputElement | null>(null);
  // const itemRefs = ref<any[]>([]); // 假设 itemRefs 是一个 ref
  onMounted(() => {
  })

</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    //  background: url("@/assets/login_images/background.jpg") center center fixed
    //    no-repeat;
    //  background-size: cover;
    background-color: #fff;
    .header {
      width: 100%;
      height: 50px;
      position: fixed;
      top: 0;
      z-index: 1000;
      background: #fff;
    }
    .header-content {
      max-width: 1280px;
      height: 100%;
      margin: 0 auto;
      position: relative;
      >span {
        display: inline-block;
        height: 50px;
        line-height: 55px;
        color: #333;
        font-size: 18px;
        font-weight: bold;
        user-select: none;
      }
      .top-name {
        position: absolute;
        right: 16px;
        font-weight: bold;
        color: #333;
        .comp-logo {
          float: right;
          width: 105px;
          height: 31px;
          font-size: inherit;
          margin: 10px 5px 0 -66px;
          margin-left: 0;
          padding: 0;
          background-size: cover;
        }
      }

    }
    .footer {
      position: fixed;
      width: 100%;
      height: 40px;
      bottom: 0;
      // background: #fff;
      background: transparent;
      min-width: 0;
    }
    .footer-content {
      position: relative;
      max-width: 1280px;
      height: 50px;
      margin: 0 auto;
      // background: #fff;
      background: transparent;
      text-align: center;
    }
    .footer-content p {
      position: absolute;
      margin: 25px auto;
      text-align: center;
      width: 100%;
      bottom: 0;
      display: block;
      font-size: 12px;
    }

    .login-btn {
      background: transparent;
      border:none;
      position: relative;
      display: inline-block;
      padding: 10px 20px;
      color: #03e9f4;
      font-size: 16px;
      text-decoration: none;
      text-transform: uppercase;
      overflow: hidden;
      transition: .5s;
      margin-top: 40px;
      letter-spacing: 4px;
    }

    .login-btn span span {
      position: absolute;
      display: block;
    }

    .login-btn span span:nth-child(1) {
      top: 0;
      left: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #03e9f4);
      animation: btn-anim1 1s linear infinite;
    }

    @keyframes btn-anim1 {
      0% {
        left: -100%;
      }
      50%,100% {
        left: 100%;
      }
    }

    .login-btn span span:nth-child(2) {
      top: -100%;
      right: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(180deg, transparent, #03e9f4);
      animation: btn-anim2 1s linear infinite;
      animation-delay: .25s
    }

    @keyframes btn-anim2 {
      0% {
        top: -100%;
      }
      50%,100% {
        top: 100%;
      }
    }

    .login-btn span span:nth-child(3) {
      bottom: 0;
      right: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(270deg, transparent, #03e9f4);
      animation: btn-anim3 1s linear infinite;
      animation-delay: .5s
    }

    @keyframes btn-anim3 {
      0% {
        right: -100%;
      }
      50%,100% {
        right: 100%;
      }
    }

    .login-btn span span:nth-child(4) {
      bottom: -100%;
      left: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(360deg, transparent, #03e9f4);
      animation: btn-anim4 1s linear infinite;
      animation-delay: .75s
    }

    @keyframes btn-anim4 {
      0% {
        bottom: -100%;
      }
      50%,100% {
        bottom: 100%;
      }
    }
  }
</style>