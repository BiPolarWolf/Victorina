
const url = window.location.href
const quizBox = document.getElementById('quiz-box')
const scoreBox = document.getElementById('score-box')
const resultBox = document.getElementById('result-box')

$.ajax({
    type :'GET',
    url : `${url}data`,
    success: function(response){
        console.log(response)
        const data = response.data
        data.forEach(element =>{
            for(const[question,answers] of Object.entries(element)){
                quizBox.innerHTML += `
                <hr>
                <div class = 'mb-2'>
                        <b>${question}</b>
                </div>
                `
                answers.forEach(answer=>{
                    quizBox.innerHTML+=`
                    <div>
                    <input type='radio' class='ans' id="${question} : ${answer}" name="${question}" value ="${answer}" >
                    <label for="${question} : ${answer}">${answer}</label>
                    </div>
                    `
                })
            }
        });
    },
    error:function(error){
        console.log(error)
    }
})

const quizForm = document.getElementById('quiz-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')


const sendData = () => {
    const elements = [...document.getElementsByClassName('ans')]
    const data = {}
    data['csrfmiddlewaretoken'] = csrf[0].value
    elements.forEach(el=>{
        
        if (el.checked){
          data[el.name] = el.value
        }
        else{
            if (!data[el.name]){
                data[el.name] = null
            }
        }
    })

    $.ajax({
        type:'POST',
        url : `${url}save/`,
        data : data,
        success: function(response){
            quizForm.classList.add('not-visible')
            const results = response.results
            
            scoreBox.innerHTML = `${response.passed ? 'Поздравляю !' : 'Упc...  :('} Твой результат : ${response.score.toFixed(2)} %` 


            results.forEach((res) =>{
                const resDiv = document.createElement('div')
                for(const [question,answer] of Object.entries(res)){
                    console.log(question)
                    console.log(answer)
                    console.log('+++++++++++')

                    resDiv.innerHTML += question
                    const cls = ['container','p-3','text-light','h6']
                    resDiv.classList.add(...cls)

                    if (answer=='not answered'){
                        resDiv.innerHTML += '- не ответили'
                        resDiv.classList.add('bg-danger')
                    } 
                    else{
                        const answered = answer['answered']
                        const correct = answer['correct_answer']
                        
                        if (answered == correct){
                            resDiv.innerHTML += ` | ответили: ${answered}`
                            resDiv.classList.add('bg-success')
                        }
                        else{
                            resDiv.innerHTML += ` | правильный ответ : ${correct}`
                            resDiv.innerHTML += ` | ответили : ${answered}`
                            resDiv.classList.add('bg-danger')
                        }
                       
                    }
                }
            // const body = document.getElementsByTagName('body')[0]
            resultBox.append(resDiv)   
            })
        
        },
        error : function(error){
            console.log(error)
        }
    })





}

quizForm.addEventListener('submit', e =>{
    e.preventDefault()

    sendData()
})

