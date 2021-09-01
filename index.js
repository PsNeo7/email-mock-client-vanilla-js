class Email {
    constructor(subject, content, folder = "Inbox", status = "Unread") {
        this.subject = subject
        this.content = content
        this.folder = folder
        this.status = status
    }
}

class Type {
    constructor(name, emailList = []) {
        this.name = name
        this.emailList = emailList
    }
}

let screenState = {
    typeIndex: 0,
    emailIndex: 0,
    typeList: [
        new Type("Inbox", [
            new Email("This is my first Email", "Hello there"),
            new Email("This is my second Email", "Hello therewe"),
            new Email("This is my third Email", "Hello there12321"),
            new Email("This is my fourth Email", "Hello there12323")
        ]
        ),
        new Type("Spam", [
            new Email("This is my first Spam Email", "12312Hello there", "Spam"),
            new Email("This is my second Spam Email", "dsfsdHello there", "Spam"),
            new Email("This is my third Spam Email", "56456Hello there", "Spam"),
            new Email("This is my fourth Spam Email", "123123Hello there", "Spam")
        ]
        ),
        new Type("Important", [
            new Email("This is my first Important Email", "Hello sdfadas there", "Important"),
            new Email("This is my second Important Email", "Hello 25345 there", "Important"),
            new Email("This is my third Important Email", "Hello 32fds there", "Important"),
            new Email("This is my fourth Important Email", "Hello 43234 there", "Important")
        ]
        )
    ]
}


function getLocalState() {
    if (!localStorage.getItem('state')) {
        localStorage.setItem('state', JSON.stringify(screenState))
        // console.log(localStorage.getItem('state'), "getstate");
    }
    return JSON.parse(localStorage.getItem('state'))
}

function setLocalState() {
    localStorage.setItem('state', JSON.stringify(screenState))
}

const inboxTypeUl = document.getElementById("inbox-type-ul")
const inboxListUl = document.getElementById("inbox-list-ul")
const emailDesc = document.getElementById("email-desc")
const parentContainer = document.getElementById("parent-container")
const folderSelector = document.getElementById("folder-selector")

parentContainer.addEventListener("click", (e) => {
    console.log(e.target.dataset.type);

    if (e.target.dataset.type == "email-type") {
        // let emailType = 
        let typeIndex = e.target.dataset.typeIndex
        screenState.typeIndex = typeIndex
        renderInboxListUl(typeIndex)
    };

    if (e.target.dataset.type == "email-link") {
        let emailIndex = e.target.dataset.emailIndex
        screenState.emailIndex = emailIndex
        renderEmail(emailIndex)
        renderinboxTypeUl()
        // render()
    };
})

const handleFolderChange = () => {
    console.log("change handler being called");
    let optioValue = document.getElementById("folder-selector").value;
    let currentEmail = screenState.typeList[screenState.typeIndex].emailList[screenState.emailIndex]
    // if(optioValue!= currentEmail.folder)
    // document.getElementById("demo").innerHTML = "You selected: " + x;
    currentEmail.folder = optioValue
    console.log(screenState.typeList);
    screenState.typeList[screenState.typeIndex].emailList.splice(screenState.emailIndex, 1)
    for (const type of screenState.typeList) {
        if (type.name == optioValue) {
            type.emailList.push(currentEmail)
        }
    }
    render()
}



const renderinboxTypeUl = () => {
    inboxTypeUl.innerHTML = ""
    screenState.typeList.forEach((type, index) => {
        let newLi = document.createElement("LI")
        newLi.innerHTML = createRenderinboxTypeUlInnerHTML(type.name, index)
        newLi.dataset.type = "email-type"
        newLi.dataset.typeIndex = index
        inboxTypeUl.appendChild(newLi)
    });
    setLocalState()
}

const createRenderinboxTypeUlInnerHTML = (name, index) => {
    let read = 0
    let currentEmails = screenState.typeList[index].emailList
    currentEmails.forEach(email => {
        if (email.status == "Read") read += 1
    });
    return `${name} ${read}/${currentEmails.length}`
}

const renderInboxListUl = (typeIndex) => {
    console.log("Index being recived", typeIndex);
    inboxListUl.innerHTML = ""
    screenState.typeList[typeIndex].emailList.forEach((email, index) => {
        let newLI = document.createElement("LI")
        newLI.innerText = email.subject
        newLI.dataset.type = "email-link"
        newLI.dataset.emailIndex = index
        inboxListUl.append(newLI)
    });
    setLocalState()
}

const renderEmail = (emailIndex) => {
    console.log(emailIndex, "email index being recievd");
    emailDesc.innerHTML = ""
    let currentEmail = screenState.typeList[screenState.typeIndex].emailList[emailIndex]
    if (currentEmail === undefined) return
    currentEmail.status = "Read"
    emailDesc.innerHTML = createEmailTemplate(currentEmail)
    setLocalState()
}

const createEmailTemplate = (currentEmail) => {
    let options = ""
    let optionsList = []

    screenState.typeList.forEach(type => {
        optionsList.push(type.name)
    });

    newOption = document.createElement("LABLE")


    optionsList.forEach((option, index) => {
        newOption = document.createElement("OPTION")
        newOption.innerText = option
        newOption.value = option
        newOption.dataset.type = "folder-change"
        if (currentEmail.folder === option) {
            newOption.selected = true
            // newOption.innerHTML = `<option value=${option} data-type="folder-change" selected="true">${option}</option>`
            let tmp = document.createElement("div");
            tmp.appendChild(newOption);
            console.log(newOption, "newoption");
            options += tmp.innerHTML
            optionsList.splice(index, 1)
        }
    });

    optionsList.forEach((option) => {
        newOption = document.createElement("OPTION")
        newOption.innerText = option
        newOption.value = option
        newOption.dataset.type = "folder-change"
        let tmp = document.createElement("div");
        tmp.appendChild(newOption);
        console.log(newOption, "newoption");
        options += tmp.innerHTML
    });



    console.log(options, "options generated");
    return `<p><b>Subject: ${currentEmail.subject}</b></p>
    <p>${currentEmail.content}</p>
    <label for="folder">Choose a different folder:</label>
    <select onchange="handleFolderChange()" id="folder-selector">
        ${options}
    </select>`
}

const render = () => {
    setLocalState()
    renderinboxTypeUl()
    renderInboxListUl(screenState.typeIndex)
    renderEmail(screenState.emailIndex)
}
if (getLocalState() != undefined) {
    screenState = getLocalState()
}
render()



