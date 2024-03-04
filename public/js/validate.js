export function findParentSelector(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) {
            return element.parentElement
        }
        element = element.parentElement
    }
}
export function checkEmpty(elementInput, parentElement, elementError, tagInvalid, message) {
    if (elementInput.value.trim() === '') {
        elementError.innerHTML = message
        parentElement.classList.add(tagInvalid)
        return false
    } else {
        elementError.innerHTML = ''
        parentElement.classList.remove(tagInvalid)
        return true
    }
}
export function checkEmail(elementInput, parentElement, elementError, tagInvalid, message) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!regex.test(elementInput.value.trim())) {
        elementError.innerHTML = message
        parentElement.classList.add(tagInvalid)
        return false
    } else {
        elementError.innerHTML = ''
        parentElement.classList.remove(tagInvalid)
        return true
    }
}
export function checkLength(elementInput, parentElement, elementError, tagInvalid, message, maxLength) {
    if (elementInput.value.length < maxLength) {
        elementError.innerHTML = message
        parentElement.classList.add(tagInvalid)
        return false
    } else {
        elementError.innerHTML = ''
        parentElement.classList.remove(tagInvalid)
        return true
    }
}

export function checkPhoneNumber(elementInput, parentElement, elementError, tagInvalid, message){
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

    if(!regex.test(elementInput.value.trim())){
        elementError.innerHTML = message
        parentElement.classList.add(tagInvalid)
        return false
    } else {
        elementError.innerHTML = ''
        parentElement.classList.remove(tagInvalid)
        return true
    }
}
export function confirmPassword(elementInput, parentElement, elementError, tagInvalid, message, password){
    if(elementInput.value !== password.value){
        elementError.innerHTML = message
        parentElement.classList.add(tagInvalid)
        return false
    }else{
        elementError.innerHTML = ''
        parentElement.classList.remove(tagInvalid)
        return true
    }
}
export function checkVerify(elementInput, parentElement, elementError, tagInvalid, message){
    if(!elementInput.checked){
        elementError.innerHTML = message
        parentElement.classList.add(tagInvalid)
        return false
    }else{
        elementError.innerHTML = ''
        parentElement.classList.remove(tagInvalid)
        return true
    }
}

