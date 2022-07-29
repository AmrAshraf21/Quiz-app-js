let countSpan = document.querySelector('.quiz-info .count span');
let bulletsSpanContainer = document.querySelector('.bullets .spans')
let currentIndex = 0;
let quizArea = document.querySelector('.quiz-area');
let answerArea = document.querySelector('.answer-area');
let submitButton = document.querySelector('.submit-button');
let countDownElement = document.querySelector('.countdown')
let rightAnswer = 0;

let bullets = document.querySelector('.bullets');
let resultContainer = document.querySelector('.results')


let countDownInterval;

function getQuestion(){
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function(){
        if(this.readyState===4 && this.status===200){

            let questionObject = JSON.parse(this.responseText);
            let qCount = questionObject.length;
            createBullets(qCount);

            addQuestionData(questionObject[currentIndex],qCount);

            countDown(5 , qCount)

            submitButton.onclick = () =>{
    
                let theRightAnswer = questionObject[currentIndex]['right_answer']
                currentIndex++;

              checkAnswer(theRightAnswer,qCount);


              quizArea.innerHTML = '';
              answerArea.innerHTML = ''
              addQuestionData(questionObject[currentIndex],qCount);
              handleBullets();
              clearInterval(countDownInterval)
              countDown(5 , qCount)

                showResult(qCount)
            
            }
            
        }
        


    }


        myRequest.open('GET','html_question.json',true);
        myRequest.send();




}
getQuestion();
function createBullets(num){

    countSpan.innerHTML = num;
    for(let i =0; i<num ; i++){

        let theBullet = document.createElement('span');

        if( i ===0){
            theBullet.className = 'on'
        }

        bulletsSpanContainer.appendChild(theBullet)

    }



}
function addQuestionData(obj,count){
    if(currentIndex < count){

        let questionTitle= document.createElement('h2');
        let questionText = document.createTextNode(obj.title)
    
        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle);
    
    for(let i =1; i<=4;i++){
        let mainDiv = document.createElement('div');
        mainDiv.className = 'answer';
        let radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'question';
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];
    if(i ===1){
        radioInput.checked = true
    }
    
    
        let theLabel = document.createElement('label');
        theLabel.htmlFor = `answer_${i}`;
        let labelText = document.createTextNode(obj[`answer_${i}`])
    
        theLabel.appendChild(labelText);
    
        mainDiv.appendChild(radioInput)
        mainDiv.appendChild(theLabel)
        answerArea.appendChild(mainDiv)
    
    
    }

    }else{
        return 0;
    }


    

}
function checkAnswer(rAnswer,count){

        let answers = document.getElementsByName('question');

        let theChoosenAnswer ;

for(let i = 0 ; i <answers.length;i++){

    if(answers[i].checked){
        theChoosenAnswer = answers[i].dataset.answer;
    }
}


if(rAnswer === theChoosenAnswer){
    rightAnswer++;
    console.log('good')
 
}
}
function handleBullets(){
let bulletsSpan = document.querySelectorAll('.bullets .spans span');
let arrayOfSpans = Array.from(bulletsSpan);
arrayOfSpans.forEach((span,index) =>{

        if(currentIndex === index){
            span.classList='on';

        }


})


}
function showResult(count){
    let theResults;
if(currentIndex === count){
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();

    if(rightAnswer > (count / 2) && rightAnswer < count){
        theResults = `<span class='good'>Good</span>${rightAnswer} From ${count}.`
    }else if(rightAnswer === count){
        theResults = `<span class='perfect'>Perfect</span> Your Answer is Good`

    }else{
        theResults = `<span class='bad'>Bad</span> You Answered ${rightAnswer} from ${count}`
    }
    resultContainer.innerHTML = theResults
    resultContainer.style.padding = '10px';
    resultContainer.style.backgroundColor = 'white';
    resultContainer.style.marginTop = '10px'
}

}

function countDown(duration,count){

    if(currentIndex < count){

        let min , sec;
        countDownInterval = setInterval(()=>{
                    min = parseInt(duration / 60);
                    sec = parseInt(duration % 60);

                    min = min < 10 ? `0${min}` : min
                    sec = sec < 10 ? `0${sec}` : sec
            countDownElement.innerHTML = `${min} : ${sec}`

            if(--duration < 0){
                clearInterval(countDownInterval);
                submitButton.click()
            }
                    

        },1000)



    }

}