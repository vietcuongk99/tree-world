<template>
    <div class="bg-gradient-primary">
      <div class="container">
        <div class="card o-hidden border-0 shadow-lg my-5">
          <div class="card-body p-0">
            <!-- Nested Row within Card Body -->
            <div class="row">
              <div class="col-lg-5 d-none d-lg-block bg-register-image"></div>
              <div class="col-lg-7">
                <div class="p-5">
                  <div class="text-center">
                    <h1 class="h4 text-gray-900 mb-4">Create an Account!</h1>
                  </div>
                  <form class="user">
                    <div class="form-group row">
                      <div class="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="text"
                          class="form-control form-control-user"
                          id="exampleFirstName"
                          placeholder="First Name"
                        />
                      </div>
                      <div class="col-sm-6">
                        <input
                          type="text"
                          class="form-control form-control-user"
                          id="exampleLastName"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <input
                        type="email"
                        class="form-control form-control-user"
                        id="exampleInputEmail"
                        placeholder="Email Address"
                      />
                    </div>
                    <div class="form-group row">
                      <div class="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="password"
                          class="form-control form-control-user"
                          id="exampleInputPassword"
                          placeholder="Password"
                        />
                      </div>
                      <div class="col-sm-6">
                        <input
                          type="password"
                          class="form-control form-control-user"
                          id="exampleRepeatPassword"
                          placeholder="Repeat Password"
                        />
                      </div>
                    </div>
                    <a
                      href="/register"
                      class="btn btn-primary btn-user btn-block"
                    >
                      Register Account
                    </a>
                    <hr />
                  </form>
                  <hr />
                  <div class="text-center">
                    <a class="small" href="forgot-password"
                      >Forgot Password?</a
                    >
                  </div>
                  <div class="text-center">
                    <a href="/login"
                      ><a class="small"
                        >Already have an account? Login!</a
                      ></a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { handleJQuery } from '../common/utils'
  export default {
    name: 'register',
    created() {
      handleJQuery()
    }
  }
  </script>
  
  <style lang="css" scoped>
  @import '../assets/css/sb-admin-2.css'
  </style>