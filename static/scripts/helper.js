function replaceSomeChar(string){
    const allChar = ['(', ')', '.', '!', '*', ' ', ',']
    const result = [...string].map(letter=>{
            if(allChar.includes(letter))    return letter.replace(letter, '')
            else                            return letter
        }) 
    return result.join('').toLowerCase().trim()
}
function sliceOutPandD(string){
    const index  = string.indexOf('(')
    const index2 = string.indexOf('-')
    if(index !== -1)    return string.slice(0, index).trim()
    if(index2 !== -1)   return string.slice(0, index2).trim()
    return string.trim()                
}

function sliceAfterComma(string){
    const index = string.indexOf(',')
    if(index !== -1) return string.slice(0,index).trim()
    return string
}

function addingUsersToUL(ul, array){
    removeElements(ul)
    array.forEach(user=>{
        const li     = document.createElement('li')
        li.id        = user.socketId

        const img    = document.createElement('img')
        img.src      = user.imageUrl

        const h2     = document.createElement('h2')
        h2.innerText = user.name
        
        const div    = document.createElement('div')
        div.appendChild(h2)
        li.appendChild(img)
        li.appendChild(div)
        ul.insertAdjacentElement('beforeend', li)
    })
}

function removeElements(container){
    while(container.firstChild){
        container.removeChild(container.firstChild)
    }
}

function removeSelf(item){
    item.parentElement.removeChild(this)
}


export {replaceSomeChar, sliceOutPandD, sliceAfterComma , addingUsersToUL, removeElements}