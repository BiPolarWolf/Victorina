console.log('hello')

const modalBtns = [...document.getElementsByClassName('modal-button')]
const modalBody = document.getElementById('modal-body-confirm')
const startButton = document.getElementById('start-button')
const url = window.location.href

modalBtns.forEach(modalBtn => modalBtn.addEventListener('click', (event) => {
    console.log(modalBtn)
    const pk = modalBtn.getAttribute('data-pk')
    const quiz = modalBtn.getAttribute('data-quiz')
    const topic = modalBtn.getAttribute('data-topic')
    const questions = modalBtn.getAttribute('data-questions')
    const time = modalBtn.getAttribute('data-time')
    const pass = modalBtn.getAttribute('data-pass')
    const difficulty = modalBtn.getAttribute('data-difficluty')
    const modalBody = document.getElementById('modal-body-confirm')
    modalBody.innerHTML = `
    <div class="h5 mb-3">Are you sure you want to begin <b>${quiz}</b> ?</div>
    <div class="text-muted">
        <ul>
            <li>difficulty: <b>${difficulty}</b></li>
            <li>number of questions: <b>${questions}</b></li>
            <li>score to pass: <b>${pass}</b></li>
            <li>time: <b>${time} min</b></li>
        </ul>
    </div> 
    `
    startButton.addEventListener('click', () => {
        window.location.href = url + pk
    })



}))