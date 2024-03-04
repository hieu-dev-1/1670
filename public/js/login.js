let $ = document.querySelector.bind(document)
let $$ = document.querySelectorAll.bind(document)

//Handle Eye password
let eye = $('#form1 .eye i')
let passwordForm = $('#form1 .form-group input[type="password"]')
eye.onclick = () => {
    if (eye.className.includes('fa-eye-slash')) {
        eye.className = eye.className.replace('fa-eye-slash', 'fa-eye')
        passwordForm.setAttribute('type', 'text')
    } else {
        eye.className = eye.className.replace('fa-eye', 'fa-eye-slash')
        password.setAttribute('type', 'password')
    }
}
import {findParentSelector, checkEmpty, checkEmail, checkLength} from './validate.js'
//Handle validation
let form = $('#form1')
let btnLogin = $('#form1 .btn-login')
let checkInput = false
let inputEmail = $('.form-group input[name="email"]')
let parentEmail = findParentSelector(inputEmail, '.form-group')
let emailError = parentEmail.querySelector('.form-message')
let inputPassword = $('.form-group input[name="password"]')
let parentPassword = findParentSelector(inputPassword, '.form-group')
let passwordError = parentPassword.querySelector('.form-message')
let loginFailed = document.querySelector('#failedLogin')
function handleValidation() {
    inputEmail.onblur = () => {
        let check = checkEmpty(inputEmail, parentEmail, emailError, 'invalid', 'Please fill in this field')
        if (check) {
            checkEmail(inputEmail, parentEmail, emailError, 'invalid', 'This field must be email with "@" character')
        }
    }
    inputEmail.oninput = () => {
        emailError.innerHTML = ''
        parentEmail.classList.remove('invalid')
        loginFailed.style.display = 'none'
    }
    inputPassword.onblur = () => {
        let check = checkEmpty(inputPassword, parentPassword, passwordError, 'invalid', 'Please fill in this field')
        if (check) {
            checkLength(inputPassword, parentPassword, passwordError, 'invalid', 'Weak password', 6)
        }
    }
    inputPassword.oninput = () => {
        passwordError.innerHTML = ''
        parentPassword.classList.remove('invalid')
        loginFailed.style.display = 'none'
    }
}
handleValidation()
btnLogin.onclick = (e) => {
    e.preventDefault()
    let check1 = checkEmpty(inputEmail, parentEmail, emailError, 'invalid', 'Please fill in this field')
    checkInput = check1
    if (check1) {
        checkInput &= checkEmail(inputEmail, parentEmail, emailError, 'invalid', 'This field must be email with "@" character')
    }
    let check2 = checkEmpty(inputPassword, parentPassword, passwordError, 'invalid', 'Please fill in this field')
    checkInput &= check2
    if (check2) {
        checkInput &= checkLength(inputPassword, parentPassword, passwordError, 'invalid', 'Weak password', 6)
    }
    if(checkInput){
        form.submit()
    }
}




